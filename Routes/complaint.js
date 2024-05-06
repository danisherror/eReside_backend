const express=require('express')
const router=express.Router()
const {addcomplaint,getcomplaint,editcomplaint,getsinglecomplaint,deleteComplaint,editstudentcomplaintstatus,wgetStudentcomplaints,getStudentcomplaints}=require('../controller/complaintController')

const {isLoggedIn}=require('../middlewares/user')
const {aisLoggedIn}=require('../middlewares/admin')
const {wisLoggedIn}=require('../middlewares/warden')

router.route('/addcomplain').post(isLoggedIn,addcomplaint)
router.route('/getcomplain').get(isLoggedIn,getcomplaint)
router.route('/updatecomplaint/:id').put(editcomplaint)
router.route('/getsinglecomplain/:id').get(getsinglecomplaint)
router.route('/getstudentroomissues').get(aisLoggedIn,getStudentcomplaints)
router.route('/wgetstudentroomissues').get(wisLoggedIn,wgetStudentcomplaints)
router.route('/editstudentcomplaintstatus/:id').patch(editstudentcomplaintstatus)
router.route('/deleteComplaint/:id').delete(isLoggedIn,deleteComplaint)
module.exports=router;