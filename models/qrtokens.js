const mongoose =require('mongoose')

const qrtokens=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
    ,
    date:{
        type:String
    },
    time:{
        type:String
    }
})

module.exports=mongoose.model('Qrtoken',qrtokens)