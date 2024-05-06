const express=require('express')
const router=express.Router()
const {signup,signin,studentProfile,editImage,editStudentProfile,applyHostel,wgetStudentprofiles,getStudentprofiles,aeditStudentProfile,astudentProfile}=require('../controller/userController')
const {isLoggedIn}=require('../middlewares/user')
const {aisLoggedIn}=require('../middlewares/admin')
const {wisLoggedIn}=require ('../middlewares/warden');
router.route('/usignup').post(signup)
router.route('/usignin').post(signin)
router.route('/studentProfile').get(isLoggedIn,studentProfile)
router.route('/editImage').patch(isLoggedIn,editImage)
router.route('/editStudentProfile').patch(isLoggedIn,editStudentProfile)
router.route('/applyHostel').patch(isLoggedIn,applyHostel)


router.route('/getstudentprofiles').get(aisLoggedIn,getStudentprofiles)
router.route('/wgetstudentprofiles').get(wisLoggedIn,wgetStudentprofiles)
router.route('/aeditstudentprofile/:id').patch(aeditStudentProfile)
router.route('/astudentProfile/:id').get(astudentProfile)


module.exports=router;