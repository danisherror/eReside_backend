const User=require('../models/user')
const BigPromise=require('../middlewares/bigPromise')
const inout=require('../models/inout')

exports.getdetails=BigPromise(async(req,res,next)=>{

    // console.log(req.body);
    const s_id=req.params.id
    const data1=await inout.find({student_id:s_id})
    // console.log(data1)
    const array=data1[0].timing
    // console.log(array)
    res.status(200).json({
        array
    })
})
exports.getdetailsStudent=BigPromise(async(req,res,next)=>{

    // console.log(req.body);
    const c_id=req.user._id

    // const data=await User.findOne({collegeid:c_id})
    // console.log(data)
    // const s_id=data._id;

    const data1=await inout.find({student_id:c_id})
    // console.log(data1)
    const array=data1[0].timing
    // console.log(array)
    res.status(200).json({
        array
    })
})
exports.getsummary=BigPromise(async(req,res,next)=>{

    // const data=await User.find({})
    // const totalStudent=data.length

    let inStudent=0;
    let outStudent=0;

    const data1=await inout.find({})

    for(let i=0;i<data1.length;i++){
        let count=data1[i].count;
        //console.log(count);
        if(count%2===0)
            inStudent++
        else
            outStudent++
    }

    res.status(200).json({
        in:inStudent,
        out:outStudent
    })
})