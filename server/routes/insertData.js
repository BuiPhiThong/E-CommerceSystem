const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const ctrls = require('../controllers/insertData')


router.post('/',ctrls.insertDataProduct)
router.post('/cate',ctrls.insertDataCategory)

module.exports=router
