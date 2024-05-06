const Warden=require('../models/warden')
const BigPromise=require('../middlewares/bigPromise')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Announcement =require("../models/announcement")
const Hostel =require('../models/hostel');

exports.signup=BigPromise(async(req,res,next)=>{

    const {name,email,password,url,collegeid,phone,hostelName}=req.body
    if(!email || !name || !password || !hostelName){
        return next(new Error("Name ,email and password are required"))
    }

    const user1=await Warden.find({email:email})
    if(user1.length!=0)
    {
        return res.status(407).json({
        })
    }
    const user2=await Warden.find({hostelName:hostelName});
    if(user2.length!=0)
    {
        return res.status(408).json({
        })
    }
    const user=await Warden.create({
        name,
        email,
        password,
        url:req.body.url1,
        collegeid,
        phone,
        hostelName
    })
    //method to generte a cookie with the token generated with the expiry date ...........................
   res.status(200).json({
   })

})

exports.signin=BigPromise(async (req,res)=>{

    const {email,password}=req.body

    const user=await Warden.findOne({email:email}).select("+password")
    if(!user)
    {
        return res.status(401).json({
            message:"User does not exsist Plz Signup"
        })
    }

    if(!await  bcrypt.compare(password,user.password)){

        return res.status(401).json({
            message:"Password does not match "
        })
    }
    const token=user.getJwtToken()
    res.status(200).json({
        user,
        token
    })

})
exports.showAllWardenDetails=BigPromise(async (req,res)=>{
    const users=(await Warden.find()).reverse();
    res.status(200).json({
        users
    })
});

exports.showWardenDetailsByid=BigPromise(async (req,res)=>{
    const id=req.params.id;
    const user=await Warden.findById(id);
    res.status(200).json({
        user
    })
});
exports.showWardenDetailsByToken=BigPromise(async (req,res)=>{
    const id=req.user._id
    const result=await Warden.findById(id);
    res.status(200).json({
        result
    })
});


exports.deleteWarden = BigPromise(async (req, res) => {
    try {
        const { hostelName } = req.body;

        // Check if hostel exists
        const existingHostel = await Warden.findOne({ hostelName:hostelName });
        if (!existingHostel) {
            return res.status(400).json({ error: 'Hostel does not exist.' });
        }

        // Delete the hostel
        await Warden.deleteMany({ hostelName:hostelName });

        // console.log(`Hostel '${hostelName}' deleted successfully.`);
        res.status(200).json({ message: `Warden for '${hostelName}' deleted successfully.` });
    } catch (error) {
        console.error('Error deleting warden:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

exports.showwardenAnnouncements= BigPromise(async (req, res, next) => {
    const id=req.user._id;
    const warden=await Warden.findById(id);
    const hostelName=warden.hostelName;
    const result=await Announcement.find({hostelName:hostelName}).sort({ createdAt: -1 });
    res.status(200).json({
        result
    })
})

exports.wgetHostelDetails=BigPromise(async(req,res,next)=>{
    const id=req.user._id;
    const warden=await Warden.findById(id);
    const hostelName=warden.hostelName;
    const result=await Hostel.find({hostelName:hostelName});
    res.status(200).json({
         result
    })
})
exports.wardenprofile=BigPromise(async(req,res)=>{

    const id=req.user._id
    const user=await Warden.findById(id);

    res.status(200).json({
        user
    })
})