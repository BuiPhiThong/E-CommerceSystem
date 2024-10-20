const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createBlog = asyncHandler(async(req,res)=>{
    const { title, description,category } = req.body
    if(!title || !description || !category) throw new Error('Missing input!')
        const response = await Blog.create(req.body)

    return res.status(200).json({
        success: response ? true : false,
        mess: response? response: 'Failed Created Blog!'
    })
})
const updBlog = asyncHandler(async(req,res)=>{
    
    const { bid } = req.params

    if(Object.keys(req.body).length === 0) throw new Error('Missing Input')

    const dataUpdated = await Blog.findByIdAndUpdate(bid , req.body , { new: true })
    
    return res.status(200).json({
        status: dataUpdated? true : false,

        mess: dataUpdated ? dataUpdated : 'Update Blog failed!'
    })

})

const delBlog = asyncHandler(async(req,res)=>{
    
    const { bid } = req.params    
    const dataDeleted = await Blog.findByIdAndDelete(bid)
    
    return res.status(200).json({
        status: dataDeleted? true : false,

        mess: dataDeleted ? dataDeleted : 'Delete Blog failed!'
    })

})
const getBlogs = asyncHandler(async(req,res)=>{
    const dataBlog = await Blog.find()

    return res.status(200).json({
        status: dataBlog? true : false,

        mess: dataBlog ? dataBlog : 'Get blog failed!'
    })

})
// người đấy có dislike blog này k => nếu có thì bỏ dislike
// người đấy đã like blog chưa
    //nếu có thì bỏ like 
    //nếu chưa thì like   
const likeBlog = asyncHandler(async(req,res)=>{

    const {_id} = req.user
    const {bid} = req.body
    if(!bid) throw new Error('Missing input')

    const blog = await Blog.findById(bid)
    const alreadyDisliked = blog.dislikes.find(item=> item.toString() === _id) 

    if(alreadyDisliked){
        const response = await Blog.findByIdAndUpdate(bid,{ $pull: { dislikes : _id } }, {new : true})

        return res.status(200).json({
            status: response? true : false,
            rs: response
        })
    }
    const isLiked = blog.likes.find(item=> item.toString() === _id)
    if(isLiked){
        const response = await Blog.findByIdAndUpdate(bid,{ $pull : { likes: _id } }, { new : true })

        return res.status(200).json({
            status: response? true : false,
            rs: response
        })
    }else{
        const response = await Blog.findByIdAndUpdate(bid,{ $push : { likes: _id } }, { new : true })

        return res.status(200).json({
            status: response? true : false,
            rs: response
        })
    }

})



const dislikeBlog = asyncHandler(async(req,res)=>{

    const {_id} = req.user
    const {bid} = req.body
    if(!bid) throw new Error('Missing input')

    const blog = await Blog.findById(bid)
    const alreadyLiked = blog.likes.find(item=> item.toString() === _id) 

    if(alreadyLiked){
        const response = await Blog.findByIdAndUpdate(bid,{ $pull: { likes : _id } }, {new : true})

        return res.status(200).json({
            status: response? true : false,
            rs: response
        })
    }
    const isDisliked = blog.dislikes.find(item=> item.toString() === _id)
    if(isDisliked){
        const response = await Blog.findByIdAndUpdate(bid,{ $pull : { dislikes: _id } }, { new : true })

        return res.status(200).json({
            status: response? true : false,
            rs: response
        })
    }else{
        const response = await Blog.findByIdAndUpdate(bid,{ $push : { dislikes: _id } }, { new : true })

        return res.status(200).json({
            status: response? true : false,
            rs: response
        })
    }
})

const getBlog= asyncHandler(async(req,res)=>{
    const { bid } = req.params

    const  response = await Blog.findByIdAndUpdate(bid,{ $inc: { numberViews : 1 } } , { new : true })
    .populate('likes','firstname lastname')
    .populate('dislikes','firstname lastname')

    return res.status(200).json({
        status : response ? true : false,
        rs: response
    })
})
module.exports ={
    createBlog,
    updBlog,
    delBlog,
    getBlogs,
    likeBlog,
    dislikeBlog,
    getBlog
}
