const ProductCategory = require('../models/productCategory')
const asyncHandler = require('express-async-handler')


const createProductCategory= asyncHandler(async(req,res) => {
    const createCategory = await ProductCategory.create(req.body)

    return res.status(200).json({
        status: createCategory ? true : false,
        mess: createCategory ? createCategory : 'Something went wrong!!!'
    })
}
)
const updCategoryProduct= asyncHandler(async(req,res)=>{

    const { cid } = req.params
    const updCategory =await ProductCategory.findByIdAndUpdate(cid, req.body , {new : true})

    return res.status(200).json({
        success: updCategory ? true : false,
        mess: updCategory? updCategory: 'Can not update category'
    })

})
const delProductCategory = asyncHandler(async(req,res)=>{
    
    const { cid } = req.params    
    const dataDeleted = await ProductCategory.findByIdAndDelete(cid)
    
    return res.status(200).json({
        status: dataDeleted? true : false,

        mess: dataDeleted ? dataDeleted : 'Delete ProductCategory failed!'
    })

})
const getCategory = asyncHandler(async(req,res)=>{

    const dataCategory = await ProductCategory.find()

    return res.status(200).json({
        status: dataCategory? true : false,

        mess: dataCategory ? dataCategory : 'Get product failed!'
    })

})


module.exports={
    createProductCategory,
    updCategoryProduct,
    delProductCategory,
    getCategory
}