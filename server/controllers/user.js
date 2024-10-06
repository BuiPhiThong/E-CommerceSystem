const User = require('../models/user')
const asyncHandler= require('express-async-handler')

const { generateAccessToken , generateRefreshToken} = require('../middlewares/jwt')

const register = asyncHandler(async(req,res)=>{
    
    const {email,password, firstname,lastname} = req.body

    if(!email || !password || !firstname || !lastname){
    return res.status(400).json({
        success: false,
        mess:'Missing input'
    })
    }

    const user = await User.findOne({email: email})

    if(user) throw new Error('User has been existed!')
        else{
                const newUser = await User.create(req.body)
               
                return res.status(200).json({
                    success: newUser ? true: false,
                    mess:newUser ? 'Register Successfully,Please login!':'Something went wrong'
                })
        }
})
//Refresh token => cấp mới access token
//Access token => xác thực người dùng, phân quyền người dùng
const login = asyncHandler(async(req,res)=>{   
    const {email,password} = req.body

    if(!email || !password){
    return res.status(400).json({
        success: false,
        mess:'Missing input'
    })
    }

   const response = await User.findOne({email:email})


   if(response && await response.isCorrectPassword(password)){
    //tách password và role ra khỏi response
    const {role, password , ...userData} = response.toObject()
    //tạo access token
    const accessToken = generateAccessToken(response._id,role)
    // tạo refresh token
    const refreshToken = generateRefreshToken(response._id)
    //Lưu refresh token vào database
    const updatetedUSer = await User.findByIdAndUpdate(response._id,{ refreshToken },{ new : true })
    //Lưu refresh token vào cookie
    if(!updatetedUSer){
        return res.status(500).json({
            success: false,
            mess:'Failed to update refresh token in database'
        })
    }

    res.cookie('refreshToken',refreshToken,{ 
        httpOnly:true ,
        axAge: 7*24*60*60*1000}
    )
    return res.status(200).json({
            success:true,
            accessToken,
            userData: userData
        })
   }else{
        throw new Error('Authentication failed')
   }
})


const getCurrentUser = asyncHandler(async(req,res)=>{   
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')

    return res.status(200).json({
        success: true,
        result : user? user: 'Can not found User!!'
    })
})

module.exports = {
     register,
     login,
     getCurrentUser
}