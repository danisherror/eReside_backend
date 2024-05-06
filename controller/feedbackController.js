const feedback=require('../models/feedback')
const BigPromise=require('../middlewares/bigPromise')
const Warden=require('../models/warden');
const Hostel =require('../models/hostel');
exports.addfeedback=BigPromise(async(req,res,next)=>{

    const {rating,review}=req.body

    const result=await feedback.create({
        user:req.user._id,
        rating:rating,
        review:review
    })
    res.status(200).json({
        result
    })
})

exports.getfeedback=BigPromise(async(req,res,next)=>{

    const user=req.user._id
    const result=await (await feedback.find({user})).reverse()
    res.status(200).json({
        result
    })
})
exports.editfeedback=BigPromise(async(req,res,next)=>{

    const id=req.params.id;
    const {review,rating}=req.body;

    await feedback.findByIdAndUpdate(id ,{
        review:review,
        rating:rating
    })

    res.status(200).json({
        message:"SUCCESSFULLY UPDATED"
    })

})
exports.getsinglefeedback=BigPromise(async(req,res,next)=>{

    const user=req.params.id;
    const result=await feedback.findById(user)
    res.status(200).json({
        result
    })
})
exports.getStudentfeedback=BigPromise(async(req,res,next)=>{

    const result= (await feedback.find()).reverse()
    res.status(200).json({
        result
    })
})

exports.wgetStudentfeedback=BigPromise(async(req,res,next)=>{
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
            const result1=await feedback.find({user:iid});
            result.push(...result1)
        }

    res.status(200).json({
         result
    })
})
exports.deleteFeedback = BigPromise(async (req, res) => {
    try {
        const id=req.params.id;

        // Check if hostel exists
        const result = await feedback.findByIdAndDelete(id);
        if (!result) {
            return res.status(400).json({ error: 'Feedback does not exist.' });
        }
        // console.log(`Hostel '${hostelName}' deleted successfully.`);
        res.status(200).json({ message: `Feedback deleted successfully.` });
    } catch (error) {
        console.error('Error deleting Feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.test=BigPromise(async(req,res,next)=>{
    res.status(200).json({
        SUCCESS
    })
})