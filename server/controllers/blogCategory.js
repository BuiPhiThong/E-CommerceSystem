const BlogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const createBlogCategory = asyncHandler(async(req,res) => {
    const createCategory = await BlogCategory.create(req.body)

    return res.status(200).json({
        status: createCategory ? true : false,
        mess: createCategory ? createCategory : 'Something went wrong!!!'
    })
})

const updBlogCategory = asyncHandler(async(req,res) => {
    const { bcid } = req.params
    const updCategory = await BlogCategory.findByIdAndUpdate(bcid, req.body, {new: true})

    return res.status(200).json({
        success: updCategory ? true : false,
        mess: updCategory ? updCategory : 'Can not update category'
    })
})

const delBlogCategory = asyncHandler(async(req,res) => {
    const { bcid } = req.params    
    const dataDeleted = await BlogCategory.findByIdAndDelete(bcid)

    return res.status(200).json({
        status: dataDeleted ? true : false,
        mess: dataDeleted ? dataDeleted : 'Delete BlogCategory failed!'
    })
})

const getBlogCategory = asyncHandler(async(req,res) => {
    const dataCategory = await BlogCategory.find()

    return res.status(200).json({
        status: dataCategory ? true : false,
        mess: dataCategory ? dataCategory : 'Get blog category failed!'
    })
})

module.exports = {
    createBlogCategory,
    updBlogCategory,
    delBlogCategory,
    getBlogCategory
}
