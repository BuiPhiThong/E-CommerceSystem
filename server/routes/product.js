const router = require('express').Router()
const ctrls = require('../controllers/product')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/',[verifyAccessToken, isAdmin],ctrls.createProduct)
router.get('/',ctrls.getProduct)
router.put('/ratings',verifyAccessToken,ctrls.ratings)

router.get('/:pid',ctrls.getProductById)


router.put('/uploadimage/:pid',[verifyAccessToken, isAdmin],uploader.array('image',10),ctrls.uploadImageProduct)
router.put('/:pid',[verifyAccessToken, isAdmin],ctrls.updProduct)
router.delete('/:pid',[verifyAccessToken, isAdmin],ctrls.delProduct)




module.exports = router

//CRUD | Create - Read -Update - Delete |Post - Get - Put -Delete
//Create +Update gửi ở body
//Get + delete - query 