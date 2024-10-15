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
    const queries = { ...req.query };
    // Loại bỏ các trường không cần thiết khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(element => delete queries[element]);

    // Chuyển đổi các toán tử so sánh thành cú pháp MongoDB
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `$${matchedEl}`);
    const formatQueries = JSON.parse(queryString);

    // Lọc sản phẩm theo tiêu chí title (nếu có)
    if (queries?.title) formatQueries.title = { $regex: queries.title, $options: 'i' };

    try {
        let sortBy='';
        if(req.query.sort){
            sortBy = req.query.sort.split(',').join(' ');
        }else{
            //mặc định sắp xếp theo createAt
            sortBy='-createdAt'
        }
        // Thực hiện truy vấn MongoDB để lấy danh sách sản phẩm
        const response = await Product.find(formatQueries).sort(sortBy);
        
        // Đếm tổng số sản phẩm thỏa mãn điều kiện
        const counts = await Product.countDocuments(formatQueries);

        return res.status(200).json({
            success: response ? true : false,
            products: response ? response : 'Can not get products',
            counts
        });
    } catch (error) {
        // Xử lý lỗi khi có vấn đề trong quá trình truy vấn
        return res.status(500).json({
            success: false,
            mess: error.message || 'Internal Server Error'
        });
    }
});


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
    getProductById
}

