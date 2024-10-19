const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const ctrls = require('../controllers/blog')



router.post('/',[verifyAccessToken, isAdmin],ctrls.createBlog)
router.get('/',ctrls.getBlog)
router.put('/like',[verifyAccessToken],ctrls.likeBlog)
router.put('/dislike',[verifyAccessToken],ctrls.dislikeBlog)

router.put('/:bid',[verifyAccessToken, isAdmin],ctrls.updBlog)
router.delete('/:bid',[verifyAccessToken, isAdmin],ctrls.delBlog)


module.exports=router