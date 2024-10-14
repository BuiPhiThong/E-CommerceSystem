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

const getProduct = asyncHandler(async(req,res)=>{

    const dataProducts = await Product.find()
    return res.status(200).json({
        status: dataProducts? true : false,

        mess: dataProducts ? dataProducts : 'Get all product failed!'
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
    getProductById
}

