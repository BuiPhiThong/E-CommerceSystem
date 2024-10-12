const jwt = require('jsonwebtoken')

const asyncHandler = require('express-async-handler')

const verifyAccessToken=asyncHandler(async(req,res, next)=>{
    //Bearer token
    
    //access token gửi trong headers có dạng : { authorization : Bearer token }
    if(req?.headers?.authorization?.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1]

        jwt.verify(token, process.env.JWT_SECRET,(err,decode)=>{
            if(err){
                return res.status(401).json({
                    success: false,
                    mess:'Invalid access token'
                })
            }
            else{
                req.user = decode
                // console.log(decode);
                
                next()
            }
        })
    } else {
        return res.status(401).json({
            success: false,
            mess:'Require authentication!!!!'
        })
    }
})

const isAdmin = asyncHandler(async(req,res,next)=>{
    const {role} = req.user

    if(role!=='admin') {
        return res.status(401).json({
            success: false,
            mess:'Require admin role!!!'
        })
    }
    next()
})


module.exports ={
    verifyAccessToken,
    isAdmin
}