const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const ctrls = require('../controllers/blog')
const uploader = require('../config/cloudinary.config')


router.post('/',[verifyAccessToken, isAdmin],ctrls.createBlog)
router.get('/',ctrls.getBlogs)
router.get('/one/:bid',ctrls.getBlog)

router.put('/like',[verifyAccessToken],ctrls.likeBlog)
router.put('/dislike',[verifyAccessToken],ctrls.dislikeBlog)

router.put('/uploadimage/:bid',[verifyAccessToken,isAdmin],uploader.single('images'),ctrls.uploadImageProduct)

router.put('/:bid',[verifyAccessToken, isAdmin],ctrls.updBlog)
router.delete('/:bid',[verifyAccessToken, isAdmin],ctrls.delBlog)


module.exports=router