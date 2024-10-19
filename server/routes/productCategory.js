const router = require('express').Router()
const ctrls = require('../controllers/productCategory')
const {  verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/',[verifyAccessToken, isAdmin], ctrls.createProductCategory)
router.get('/', ctrls.getCategory)


router.put('/:cid',[verifyAccessToken, isAdmin], ctrls.updCategoryProduct)
router.delete('/:cid',[verifyAccessToken, isAdmin], ctrls.delProductCategory)



module.exports=router