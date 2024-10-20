const Brand = require('../models/brand')
const asyncHandler = require('express-async-handler')

const createBrand = asyncHandler(async(req,res) => {
    const createBrand = await Brand.create(req.body)

    return res.status(200).json({
        status: createBrand ? true : false,
        mess: createBrand ? createBrand : 'Something went wrong!!!'
    })
})

const updBrand = asyncHandler(async(req,res) => {
    const { bid } = req.params
    const updBrand = await Brand.findByIdAndUpdate(bid, req.body, {new: true})

    return res.status(200).json({
        success: updBrand ? true : false,
        mess: updBrand ? updBrand : 'Can not update brand'
    })
})

const delBrand= asyncHandler(async(req,res) => {
    const { bid } = req.params    
    const dataDeleted = await Brand.findByIdAndDelete(bid)

    return res.status(200).json({
        status: dataDeleted ? true : false,
        mess: dataDeleted ? dataDeleted : 'Delete brand failed!'
    })
})

const getBrand = asyncHandler(async(req,res) => {
    const dataBrand = await Brand.find()

    return res.status(200).json({
        status: dataBrand ? true : false,
        mess: dataBrand ? dataBrand : 'Get Brand failed!'
    })
})

module.exports = {
    getBrand, delBrand, createBrand, updBrand
}
