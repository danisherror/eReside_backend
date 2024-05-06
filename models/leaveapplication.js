const mongoose =require('mongoose')

const leaveapplicationSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
    ,
    startDate:{
        type:String,
        required:true
    },

    endDate:{
        type:String,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'Pending'
    }
})

module.exports=mongoose.model('Leaveapplication',leaveapplicationSchema)