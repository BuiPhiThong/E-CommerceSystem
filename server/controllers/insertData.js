const dataProduct = require('../../data/data2.json')
const dataCategory = require('../../data/cate_brand')
const asyncHandler = require('express-async-handler')
const Product = require('../models/product')
const slugify = require('slugify')
const ProductCategory = require('../models/productCategory')

const fn = async(product)=>{
  await Product.create({
    title: product?.name,
    slug: slugify(product?.name)+Math.round(Math.random() *100)+' ',
    description: product?.description,
    brand: product?.brand,
    price: Math.round(Number(product?.price?.match(/\d/g).join(''))/100),
    category: product?.category[1],
    quantity:Math.round(Math.random() *1000),
    sold: Math.round(Math.random() *100),
    images: product?.images,
    color: product?.variants?.find(el=> el.label ==='Color')?.variants[0]
  })
}
const fn2 = async(cate)=>{
    await ProductCategory.create({
      title: cate?.cate,
      brand: cate?.brand,
      
    })
  }

const insertDataProduct = asyncHandler(async(req,res)=>{
    const promise=[]
    for(let product of dataProduct) promise.push(fn(product))
    await Promise.all(promise)
    return res.json('Done')
})
const insertDataCategory = asyncHandler(async(req,res)=>{
    const promise=[]
    for(let category of dataCategory) promise.push(fn2(category))
    await Promise.all(promise)
    return res.json('Done')
})

module.exports={
    insertDataProduct,
    insertDataCategory
}