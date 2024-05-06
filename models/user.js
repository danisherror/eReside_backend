const mongoose =require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const { url } = require('inspector')
const userSchema=new mongoose.Schema({
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
    semester:{
        type:String
    },
    status:{
        type:String,
        default:'inactive'                                           
    },
    hostelName:{
        type:String,
        default:'None'                                           
    },
    block:{
        type:String,
        default:'None'                                           
    },
    roomNo:{
        type:String,
        default:'None'                                           
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },

})

//encrypt password before save  - HOOKS    before saving perform this method
userSchema.pre('save',async function(next){

    if(!this.isModified('password')) return next();                    // by this method we specify then whenever we modify the password then only we have to encrypt it
    this.password=await bcrypt.hash(this.password,10)
})

//validate the password with passed on user password 
userSchema.methods.isValidatedPassword=async function(usersendPassword){
    return await bcrypt.compare(usersendPassword,this.password)                // this will return true /false result
}

//create and return jwt token

userSchema.methods.getJwtToken=function(){
   return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY
    })
}


module.exports=mongoose.model('User',userSchema)

