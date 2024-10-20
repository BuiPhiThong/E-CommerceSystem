const router = require('express').Router()
const ctrls = require('../controllers/coupon')
const {  verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/',[verifyAccessToken, isAdmin], ctrls.createCoupon)
router.get('/', ctrls.getCoupon)


router.put('/:cid',[verifyAccessToken, isAdmin], ctrls.updCoupon)
router.delete('/:cid',[verifyAccessToken, isAdmin], ctrls.delCoupon)



module.exports=router