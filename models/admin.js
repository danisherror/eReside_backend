const mongoose =require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const { url } = require('inspector')
const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please Provide a name'],               // The error message is also passed
        maxlength:[40,'Name should be under 40 characters']
    },
    email:{
        type:String,
        required:[true,'Please Provide a email'],               
        validate:[validator.isEmail,'Please enter a valid email'],               
        unique:true                                             // The mongoose will automatically look in the database for unique email
    },
    password:{
        type:String,
        required:[true,'Please Provide a password'],               
        select:false                                            // the password field not comes in with the UserSchema
    },
    url:{
        type:String
    },
    collegeid:{
        type:String
    },
    phone:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },

})

//encrypt password before save  - HOOKS    before saving perform this method
adminSchema.pre('save',async function(next){

    if(!this.isModified('password')) return next();                    // by this method we specify then whenever we modify the password then only we have to encrypt it
    this.password=await bcrypt.hash(this.password,10)
})

//validate the password with passed on user password 
adminSchema.methods.isValidatedPassword=async function(adminsendPassword){
    return await bcrypt.compare(adminsendPassword,this.password)                // this will return true /false result
}

//create and return jwt token

adminSchema.methods.getJwtToken=function(){
   return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY
    })
}


module.exports=mongoose.model('Admin',adminSchema)

