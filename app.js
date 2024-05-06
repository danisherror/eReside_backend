const express=require('express')
const app=express()
require('dotenv').config()
// const morgan = require('morgan')
// const cookieParser=require('cookie-parser')
// const fileUpload=require('express-fileupload')

//reguglar miidelware
app.use(express.json())                             // To handle the json
app.use(express.urlencoded({extended:true}))        //to handle something comming in the body

const user=require('./Routes/user')
const feedback=require('./Routes/feedback')
const complaint=require('./Routes/complaint')
const admin=require('./Routes/admin')
const hostel=require('./Routes/hostel')
const leaveApplication= require("./Routes/leaveapplication")
const qrtokens = require('./Routes/qrtokens')
const warden =require('./Routes/warden')
const inout=require('./Routes/inout')
const cors = require('cors');
app.use(cors({
    origin: process.env.front_end_url
}));
//test route
app.use("/api/v1",user)
app.use("/api/v1",feedback)
app.use("/api/v1",complaint)
app.use("/api/v1",admin)
app.use("/api/v2",hostel)
app.use("/api/v1",leaveApplication)
app.use("/api/v1",qrtokens)
app.use("/api/v1",warden)
app.use("/api/v1",inout)
app.get('/test',(req,res)=>{
    res.send("SUCCESS")
})


//export app.js
module.exports=app;