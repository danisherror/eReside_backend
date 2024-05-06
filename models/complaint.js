const mongoose =require('mongoose')

const complaintSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
    ,
    title:{
        type:String
    },
    description:{
        type:String
    },
    status:{
        type:String,
        default:'Pending'
    }
})

module.exports=mongoose.model('Complaint',complaintSchema)