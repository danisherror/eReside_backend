const Leave =require("../models/leaveapplication")
const Warden=require('../models/warden')
const Hostel =require('../models/hostel');
const BigPromise=require('../middlewares/bigPromise')

exports.addleaveappliacation=BigPromise(async(req,res,next)=>{

    const {startDate,endDate,reason}=req.body

    const result=await Leave.create({
        user:req.user._id,
        startDate:startDate,
        endDate:endDate,
        reason:reason
    })
    res.status(200).json({
        result
    })
})
exports.getleaveapplication=BigPromise(async(req,res,next)=>{

    const user=req.user._id
    const result= (await Leave.find({user})).reverse()
    res.status(200).json({
        result
    })
})
exports.editleaveapplication=BigPromise(async(req,res,next)=>{

    const id=req.params.id;
    await Leave.findByIdAndUpdate(id,req.body,{
        new:true
    });

    res.status(200).json({
        message:"SUCCESSFULLY UPDATED"
    })

})
exports.getsingleleaveapplication=BigPromise(async(req,res,next)=>{

    const user=req.params.id
    const result=await Leave.findById(user)
    res.status(200).json({
        result
    })
})
exports.getallleaveapplication=BigPromise(async(req,res,next)=>{

    const result= (await Leave.find()).reverse()
    if(!result)
    {
        res.status(404).json({
            message:"No leave application found"
        })
    }
    res.status(200).json({
        result
    })
})
exports.wgetallleaveapplication=BigPromise(async(req,res,next)=>{
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
    const result=[]
        for(let i=0;i<user_id.length;i++)
        {
            const iid=user_id[i];
            const result1=await Leave.find({user:iid});
            result.push(...result1)
        }
    if(!result)
    {
        res.status(404).json({
            message:"No leave application found"
        })
    }
    // console.log(result);
    res.status(200).json({
        result
    })
})
exports.deleteLeave = BigPromise(async (req, res) => {
    try {
        const id=req.params.id;

        // Check if hostel exists
        const result = await Leave.findByIdAndDelete(id);
        if (!result) {
            return res.status(400).json({ error: 'Leave does not exist.' });
        }
        // console.log(`Hostel '${hostelName}' deleted successfully.`);
        res.status(200).json({ message: `Leave deleted successfully.` });
    } catch (error) {
        console.error('Error deleting Leave:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});