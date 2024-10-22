const router = require('express').Router()
const ctrls = require('../controllers/user')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/register',ctrls.register)

router.post('/login',ctrls.login)

router.get('/current',verifyAccessToken ,ctrls.getCurrentUser)

router.post('/refreshtoken' ,ctrls.refreshAccessToken)
router.get('/forgotpassword', ctrls.forgotPassword)

router.get('/logout' ,ctrls.logout)
router.put('/resetpassword' ,ctrls.resetPassword)

router.put('/cart',verifyAccessToken,ctrls.addToCart)

router.get('/' ,[verifyAccessToken,isAdmin ],ctrls.getAllUser)

router.delete('/',[verifyAccessToken,isAdmin ],ctrls.delUser)

router.put('/current',[verifyAccessToken],ctrls.updUser)

router.put('/updaddress',[verifyAccessToken],ctrls.updAddress)

router.put('/:uid',[verifyAccessToken, isAdmin],ctrls.updUserById)


module.exports = router

//CRUD | Create - Read -Update - Delete |Post - Get - Put -Delete
//Create +Update gửi ở body
//Get + delete - query 