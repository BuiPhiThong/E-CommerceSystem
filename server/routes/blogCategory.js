const router = require('express').Router()
const ctrls = require('../controllers/blogCategory')
const {  verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/',[verifyAccessToken, isAdmin], ctrls.createBlogCategory)
router.get('/', ctrls.getBlogCategory)


router.put('/:bcid',[verifyAccessToken, isAdmin], ctrls.updBlogCategory)
router.delete('/:bcid',[verifyAccessToken, isAdmin], ctrls.delBlogCategory)



module.exports=router