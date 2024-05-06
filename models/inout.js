const mongoose = require('mongoose');

const inoutSchema=new mongoose.Schema(
        {
            student_id:{
                type:String
            },
            count:{
                type:Number
            },
            timing:[
                {
                    in_time:{
                        type:String,
                        default:null
                    },
                    in_date:{
                        type:String,
                        default:null
                    },
                    out_time:{
                        type:String,
                        default:null
                    },
                    out_date:{
                        type:String,
                        default:null
                    }
                }
            ]
        }
    
)
module.exports=mongoose.model('Inout',inoutSchema)