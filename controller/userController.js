const User=require('../models/user')
const BigPromise=require('../middlewares/bigPromise')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Hostel=require('../models/hostel')
const Warden=require('../models/warden')

exports.signup=BigPromise(async(req,res,next)=>{

    const {name,email,password,url,collegeid,phone,semester}=req.body
    if(!email || !name || !password){
        // return next(new CustomError('Plz Send Email',400))
        return next(new Error("Name ,email and password are required"))
    }
    const user=await User.create({
        name,
        email,
        password,
        url:req.body.url1,
        collegeid,
        phone,
        semester
    })
   res.status(200).json({
        name,
        email,
        token:user.getJwtToken()
   })

})

exports.signin=BigPromise(async (req,res)=>{

    const {email,password}=req.body

    const user=await User.findOne({email:email}).select("+password")
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
exports.studentProfile=BigPromise(async(req,res)=>{

    const id=req.user._id
    const user=await User.findById(id);

    res.status(200).json({
        user
    })
})
exports.editImage=BigPromise(async(req,res)=>{
    try{
    const id=req.user._id
    const user=await User.findByIdAndUpdate(id,
        {
          url:req.body.url
        });
    res.status(200).json({

    })
    }
    catch(error)
    {
        console.log(error);
    }
})
exports.editStudentProfile=BigPromise(async(req,res)=>{
    try{
    const id=req.user._id
    const user=await User.findByIdAndUpdate(id,req.body,{
        new:true
    });
    res.status(200).json({

    })
    }
    catch(error)
    {
        console.log(error);
    }
})
exports.applyHostel=BigPromise(async(req,res)=>{
    const {  hostelName, block, roomNumber } = req.body;
    const studentId=req.user._id
    try {
        // Check if the specified room exists in the database
        if (!hostelName || !block || !roomNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingRoom = await Hostel.findOne({
            hostelName: hostelName,
            block: block,
            roomNumber: roomNumber
        });

        if (!existingRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }
        // Check if the room is already full
        if (existingRoom.studentIds.length >= existingRoom.capacity) {
            return res.status(401).json({ error: 'Room is already full. Please choose another room.' });
        }
        const occupiedRoom = await Hostel.find({studentIds: studentId});
        if (occupiedRoom.length>0) {
            return res.status(400).json({ error: 'student is already assigned to a room' });
        }
        if (existingRoom.studentIds.includes(studentId)) {
            return res.status(402).json({ error: 'Student is already assigned to this room' });
        }

        // Update the student's hostel information in the database
        existingRoom.studentIds.push(studentId);
        await existingRoom.save();

        // Return success response
        res.status(200).json({ message: 'Hostel application successful', room: existingRoom });
    } catch (error) {
        console.error('Error applying hostel:', error);
        // Return error response
        res.status(500).json({ error: 'Internal server error' });
    }
})
exports.aeditStudentProfile=BigPromise(async(req,res)=>{
    try{
    const id=req.params.id
    const user=await User.findByIdAndUpdate(id,req.body,{
        new:true
    });
    // console.log(user);
    res.status(200).json({

    })
    }
    catch(error)
    {
        console.log(error);
    }
})
exports.getStudentprofiles=BigPromise(async(req,res)=>{

    const id=req.user._id
    const user= (await User.find()).reverse()

    res.status(200).json({
        user
    })
})
exports.wgetStudentprofiles=BigPromise(async(req,res)=>{

    const id=req.user._id;
    const warden=await Warden.findById(id);
    const hostelName=warden.hostelName;
    const rooms=await Hostel.find({hostelName:hostelName});
    const user_id=[];
    for(let i=0;i<rooms.length;i++)
    {
        const op=rooms[i].studentIds;
        for(let j=0;j<op.length;j++)
        {
            user_id.push(op[j]);
        }
    }
    // console.log(user_id);
    const user=[]
    // console.log(user_id);
        for(let i=0;i<user_id.length;i++)
        {
            const iid=user_id[i];
            const result1=await User.find({_id:iid});
            user.push(...result1)
        }
    res.status(200).json({
        user
    })
})
exports.astudentProfile=BigPromise(async(req,res)=>{

    const id=req.params.id;
    const user=await User.findById(id);
    // console.log("------------------------------")
    // console.log(user)
    res.status(200).json({
        user
    })
})

