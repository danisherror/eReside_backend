const mongoose =require('mongoose')

const feedbackSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    rating:{type:String},
    review:{type:String}
})

module.exports=mongoose.model('Feedback',feedbackSchema)