const express=require('express')
const router=express.Router()
const {applyhostel}=require('../controller/hostelController')

const {isLoggedIn}=require('../middlewares/user')

router.route('/applyhostell').post(isLoggedIn,applyhostel)

module.exports=router;