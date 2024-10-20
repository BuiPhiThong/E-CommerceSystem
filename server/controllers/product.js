const e = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')


const createProduct = asyncHandler(async(req,res)=>{
    
    if(Object.keys(req.body).length === 0) throw new Error('Missing Input')

    if(req.body.title) req.body.slug = slugify(req.body.title) 
        
    const productData = await Product.create(req.body)
    
    return res.status(200).json({
        status: productData? true : false,

        mess: productData ? productData : 'Can not create product'
    })

})

const updProduct = asyncHandler(async(req,res)=>{
    
    const { pid } = req.params

    if(Object.keys(req.body).length === 0) throw new Error('Missing Input')

    if(req.body.title) req.body.slug = slugify(req.body.title) 
        
    const dataUpdated = await Product.findByIdAndUpdate(pid , req.body , { new: true })
    
    return res.status(200).json({
        status: dataUpdated? true : false,

        mess: dataUpdated ? dataUpdated : 'Update product failed!'
    })

})

const delProduct = asyncHandler(async(req,res)=>{
    
    const { pid } = req.params    
    const dataDeleted = await Product.findByIdAndDelete(pid)
    
    return res.status(200).json({
        status: dataDeleted? true : false,

        mess: dataDeleted ? dataDeleted : 'Delete product failed!'
    })

})

//filter , sorting & pagination
// const getProduct = asyncHandler(async(req,res)=>{
//     const queries = {...req.query}

//     //tách các tường đặc biệt ra khỏi query
//     const excludeFiedls = ['limit','sort','page','fields']
//     excludeFiedls.forEach(element => {
//         return delete queries[element]
//     });


//     //Format lại các operator cho đúng cú pháp mongoose
//     let queryString = JSON.stringify(queries)
//     queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `$${matchedEl}`)
//     const formatQueries = JSON.parse(queryString)

//     //Filtering
//     if(queries?.title) formatQueries.title = { $regex : queries.title, $options: 'i' }

//     let queryCommand = Product.find(formatQueries)

//     //Execute query
//     //Số lượng sản phẩm thỏa mãn điều kiện !== Số lượng sản phẩm trả về 1 lần gọi API

//     queryCommand.exec(async(err,response)=>{
//         if(err) throw new Error(err.message)

//             const counts = await Product.find(formatQueries).countDocuments()

//             return res.status(200).json({
//                 success: response ? true : false,
//                 products: response? response : 'Can not get  products',
//                 counts
//             })
//     })
// })
const getProduct = asyncHandler(async(req, res) => {
    const queries = { ...req.query};
    // Loại bỏ các trường không cần thiết khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(element => delete queries[element]);

    // Chuyển đổi các toán tử so sánh thành cú pháp MongoDB
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `$${matchedEl}`);
    const formatQueries = JSON.parse(queryString);//chuyển chuỗi Json đã sửa thành lại object

    // Lọc sản phẩm theo tiêu chí title (nếu có)
    if (queries?.title) formatQueries.title = { $regex: queries.title, $options: 'i' };

    try {
        let sortBy='';
        if(req.query.sort){
            sortBy = req.query.sort.split(',').join(' ');
        }else{
            //mặc định sắp xếp theo createAt    
            sortBy='createdAt'
        }
        // Thực hiện truy vấn MongoDB để lấy danh sách sản phẩm
        let queryCommand = Product.find(formatQueries).sort(sortBy);
        
        //Fields limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ')

            queryCommand =  Product.find(formatQueries).sort(sortBy).select(fields);
        }

        //thực hiện pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page - 1) * limit

        queryCommand = queryCommand.skip(skip).limit(limit);  // Áp dụng phân trang
        // Đếm tổng số sản phẩm thỏa mãn điều kiện
        const counts = await Product.countDocuments(formatQueries);
        // trả về kết quả cuối cùng
        const response = await queryCommand

        return res.status(200).json({
            success: response ? true : false,
            products: response ? response : 'Can not get products',
            counts,
            totalPage:Math.ceil(counts/limit),
            currentPage: page
        });
    } catch (error) {
        // Xử lý lỗi khi có vấn đề trong quá trình truy vấn
        return res.status(500).json({
            success: false,
            mess: error.message || 'Internal Server Error'
        });
    }
});

const ratings= asyncHandler(async(req,res)=>{
    const {_id} = req.user

    const {star, comment, pid} = req.body

    if(!star || !pid) throw new Error('Missing input rating products!')

    const ratingProduct = await Product.findById(pid)
    
    const alreadyRating = ratingProduct?.ratings.find(item => item.postedBy.toString() === _id)
    // console.log({alreadyRating})
    if(alreadyRating){
        //update star & comment
        await Product.updateOne({
            ratings: { $elemMatch : alreadyRating}
        },{
            $set:{"ratings.$.star": star, "ratings.$.comment": comment}
        }, {new : true})
    }else{
        //chua danh giá : add star& comment
        await Product.findByIdAndUpdate(pid,{
            $push:{ ratings: {star, comment, postedBy:_id} }
        }, {new :true})
    }

    //total rating
    const updatedProduct = await Product.findById(pid)
    const countRating = updatedProduct.ratings.length

    let totalRating = 0;
    updatedProduct.ratings.forEach(rating => {
        totalRating += rating.star;
    });

    const averageStar = Math.round(totalRating*10/ countRating) / 10 
    updatedProduct.totalRatings= averageStar
    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        updatedProduct
    })
})

const getProductById = asyncHandler(async(req,res)=>{

    const { pid } = req.params
    const dataProduct = await Product.findById(pid)

    return res.status(200).json({
        status: dataProduct? true : false,

        mess: dataProduct ? dataProduct : 'Get product failed!'
    })

})
module.exports ={
    createProduct,
    updProduct,
    delProduct,
    getProduct,
    getProductById,
    ratings
}

