const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')

const asyncHandler = require('express-async-handler')


const createOrder = asyncHandler(async(req,res)=>{
    const { _id } = req.user
    const { coupon } = req.body
    const response =await User.findById(_id).select('cart').populate('cart.product','title price')

    const products= response.cart.map(el=>({
        product : el.product._id,
        count:el.quantity,
        color: el.color
    }))
    let total = response.cart.reduce((sum,el)=>el.quantity * el.product.price +sum , 0)
    let couponId = null
    if(coupon) {
        const giftcode = await Coupon.findOne({ name: coupon.toUpperCase() });
    
        if(giftcode.expiry < Date.now()){
            return res.status(200).json({
                mess: 'Coupon expried'
            })
        }
        if(!giftcode){
            return res.status(200).json({
                mess: 'Coupon not existed'
            })
        }
        total = Math.round(total * (1 - giftcode.discount / 100));
        couponId = coupon._id
    }else{
        return res.status(400).json({
            status: false,
            mess: 'Coupon không hợp lệ'
        });
    }

    const order = await Order.create({products, total, orderBy: _id,coupon : couponId})
    return res.status(200).json({
        status: order ? true : false,
        mess: order? order : "Some thing went wrong"
    })
})

const getOrderByUserId = asyncHandler(async(req,res)=>{
    const { _id } = req.user
   
    const response =await Order.findOne({orderBy : _id}).populate('products.product','title price').populate('orderBy','firstname lastname')
    return res.status(200).json({
        status: response ? true : false,
        mess: response? response : "Some thing went wrong"
    })
})
const getOrders= asyncHandler(async(req,res)=>{

    const response =await Order.find()
    return res.status(200).json({
        status: response ? true : false,
        mess: response? response : "Some thing went wrong"
    })
})
const updateStatusOrder = asyncHandler(async(req,res)=>{
    const {status } = req.body
    const { oid } = req.params
   
    const response =await Order.findByIdAndUpdate(oid,{ status: status }, { new : true})
    return res.status(200).json({
        status: response ? true : false,
        mess: response? response : "Some thing went wrong"
    })
})
module.exports ={
    createOrder,
    getOrderByUserId,
    updateStatusOrder,
    getOrders
}