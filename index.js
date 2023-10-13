const express=require("express");
const app=express();
app.use(express.json());
require("dotenv").config();
const {db_connect}=require("./config/db_connect");
const port= process.env.port ||4000;
const  cookieParser = require('cookie-parser');
app.use(cookieParser());
const Cors = require('cors');
const fileupload=require("express-fileupload");
const{cloudinary_connect}= require("./config/cloudinary_connect");
app.use(Cors(
{
    origin:"http://localhost:3000",
    Credential:true,
}
));

app.use(fileupload(
    {
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }
));


const CourseRoutes= require("./routes/courses");
const PaymentRoutes=require("./routes/payments");
const ProfileRoutes= require("./routes/profile");
const UserRoutes=require("./routes/User");



app.listen(port,()=>
{
    console.log("server startted successfully",port);
});



// mount the route

app.use("/api/v1/Course",CourseRoutes);
app.use("/api/v1/Profile",ProfileRoutes);
app.use("/api/v1/Payment",PaymentRoutes);
app.use("/api/v1/Auth",UserRoutes);


app.get("*",(req,res)=>
{
    res.send("hi");

});
db_connect();
cloudinary_connect();