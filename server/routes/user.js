const router = require('express').Router()
const ctrls = require('../controllers/user')
const {verifyAccessToken} = require('../middlewares/verifyToken')

router.post('/register',ctrls.register)

router.post('/login',ctrls.login)

router.get('/current',verifyAccessToken ,ctrls.getCurrentUser)

router.post('/refreshtoken' ,ctrls.refreshAccessToken)
router.get('/forgotpassword', ctrls.forgotPassword)

router.get('/logout' ,ctrls.logout)
router.put('/resetpassword' ,ctrls.resetPassword)
module.exports = router

//CRUD | Create - Read -Update - Delete |Post - Get - Put -Delete
//Create +Update gửi ở body
//Get + delete - query 