const mongoose =require('mongoose')

const announcementSchema=new mongoose.Schema({
    hostelName:{
        type:String
    },
    url:{
        type:String
    },
    announcement:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
})

module.exports=mongoose.model('Announcement',announcementSchema)