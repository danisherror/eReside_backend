const Qrtokens = require('../models/qrtokens');
const BigPromise = require('../middlewares/bigPromise');
const Warden=require('../models/warden');
const Hostel =require('../models/hostel');
const inOut=require('../models/inout')
exports.addqrtokens = BigPromise(async (req, res, next) => {
    const tokens = req.body.scanResults; // Assuming tokens are sent in an array in req.body
    const s_id=tokens[0]._id
    const time=tokens[0].time
    const date=tokens[0].date
    
    const data=await inOut.findOne({"student_id":s_id})
    if(!data){
        const time1=[
            {
                in_time:time,
                in_date:date,
            }
        ]
        // console.log(time1)
        const result=await inOut.create({
            student_id:s_id,
            timing:[
                {
                    out_time:time,
                    out_date:date,
                }
            ],
            count:1

        })
        // console.log(result)
    }
    else{
        // console.log(data);
        let array=data.timing
        // console.log(array)
        let count=data.count
        // console.log(count)
        if(count%2===0){
            array[array.length]={
                out_time:time,
                out_date:date,
            }
          
            // console.log(array);
            count=count+1;
        }
        else{
            // console.log("ODDDDDDDDDDDDDDDDDDDDDDDD")
            array[array.length-1].in_time=time
            array[array.length-1].in_date=date
            // console.log(array);
            count=count+1;


        }
        const res=await inOut.findByIdAndUpdate(data._id,{
            timing:array,
            count:count
        })
        // console.log(res)
    }


    for (let i = 0; i < tokens.length; i++) {
        const result = await Qrtokens.create({
            user: tokens[i]._id,
            date: tokens[i].date,
            time: tokens[i].time // Assuming tokens have date and time properties
        });
    }

    res.status(200).json({});
});

exports.wgetallqrtokens=BigPromise(async(req,res,next)=>{
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
        const result=[]
        for(let i=0;i<user_id.length;i++)
        {
            const iid=user_id[i];
            const result1=await Qrtokens.find({user:iid});
            result.push(...result1)
        }
    res.status(200).json({
        result
    })
})
exports.getallqrtokensbyhostel=BigPromise(async(req,res,next)=>{
    const hostelName=req.params.hostelName;
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
        const result=[]
        for(let i=0;i<user_id.length;i++)
        {
            const iid=user_id[i];
            const result1=await Qrtokens.find({user:iid});
            result.push(...result1)
        }
    res.status(200).json({
        result
    })
})
exports.getallqrtokens=BigPromise(async(req,res,next)=>{

    const result=await Qrtokens.find()
    res.status(200).json({
        result
    })
})

exports.getsingleqrtokenbyid=BigPromise(async(req,res,next)=>{
    const user=req.params.id
    const result=await Qrtokens.find({user})
    res.status(200).json({
        result
    })
})

exports.getsingleqrtokenbytoken=BigPromise(async(req,res,next)=>{
    const user=req.user._id
    const result=await Qrtokens.find({user})
    res.status(200).json({
        result
    })
})
