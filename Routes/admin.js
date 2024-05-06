const express=require('express')
const router=express.Router()
const {signup,signin,adminprofile,getsingleAnnouncement,deleteStudentInfo,deleteStudent,deleteAnnouncement,showAllAnnouncements,updateAnnouncement,createAnnouncement,showStudentAnnouncements,editImage,getUniqueHostelNames,editAdminProfile,createHostel,deleteHostel,getHostelDetails,getStudentHostel,hostelFormDetails}=require('../controller/adminController')
const {aisLoggedIn}=require('../middlewares/admin')
const {isLoggedIn}=require('../middlewares/user')
const {wisLoggedIn}=require('../middlewares/warden');
router.route('/asignup').post(signup)
router.route('/asignin').post(signin)
router.route('/adminprofile').get(aisLoggedIn,adminprofile)
router.route('/aeditImage').patch(aisLoggedIn,editImage)
router.route('/editAdminProfile').patch(aisLoggedIn,editAdminProfile)


router.route('/createHostel').post(aisLoggedIn,createHostel)
router.route('/deleteHostel').delete(aisLoggedIn,deleteHostel)
router.route('/getHostelDetails').get(aisLoggedIn,getHostelDetails)
router.route('/hgetHostelDetails').get(getHostelDetails)
router.route('/getStudentHostel/:id').get(getStudentHostel)
router.route('/getUniqueHostelNames/').get(getUniqueHostelNames)
router.route('/hostelFormDetails').get(isLoggedIn,hostelFormDetails)

router.route('/createAnnouncement').post(aisLoggedIn,createAnnouncement)
router.route('/showAllAnnouncements').get(aisLoggedIn,showAllAnnouncements)
router.route('/getsingleAnnouncement/:id').get(aisLoggedIn,getsingleAnnouncement)
router.route('/updateAnnouncement/:id').patch(updateAnnouncement)
router.route('/showStudentAnnouncements').get(isLoggedIn,showStudentAnnouncements)
router.route('/deleteAnnouncement/:id').delete(aisLoggedIn,deleteAnnouncement)
router.route('/deleteStudentInfo/:id').delete(aisLoggedIn,deleteStudentInfo)
router.route('/deleteStudent/:id').delete(aisLoggedIn,deleteStudent)

router.route('/wdeleteAnnouncement/:id').delete(wisLoggedIn,deleteAnnouncement)

module.exports=router;