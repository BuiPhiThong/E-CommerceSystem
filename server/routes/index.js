const userRouter = require('./user')
const productRouter = require('./product')
const productCategory = require('./productCategory')
const blogCategory = require('./blogCategory')
const blog = require('./blog')
const brand = require('./brand')
const coupon = require('./coupon')
const order = require('./order')

const {notFound,errHandler} = require('../middlewares/errHandler')


const initRoutes = (app)=>{
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/prodcategory',productCategory)
    app.use('/api/blog',blog)
    app.use('/api/blogcategory',blogCategory)
    app.use('/api/brand',brand)
    app.use('/api/coupon',coupon)
    app.use('/api/order',order)

    app.use(notFound)
    app.use(errHandler)
}


module.exports= initRoutes