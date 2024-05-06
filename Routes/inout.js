const express=require('express')
const router=express.Router()
const{getdetails,getdetailsStudent,getsummary}=require('../controller/inoutController')
const {isLoggedIn}=require('../middlewares/user')
const {aisLoggedIn}=require('../middlewares/admin')
const {wisLoggedIn}=require('../middlewares/warden');
router.route('/agetinoutdetail/:id').get(aisLoggedIn,getdetails)
router.route('/wgetinoutdetail/:id').get(wisLoggedIn,getdetails)
router.route('/getinoutdetailStudent').get(isLoggedIn,getdetailsStudent)
router.route('/agetinoutsummary').get(aisLoggedIn,getsummary)

module.exports=router;