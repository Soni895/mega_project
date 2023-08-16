const express=require("express");
const app=express();
require("dotenv").config();
const {db_connect}=require("./config/db_connect");
const port= process.env.port;
const{cloudinary_connect}= require("./config/cloudinary_connect");
app.listen(port,()=>
{
    console.log("server startted successfully",port);
});
app.get("*",(req,res)=>
{
    res.send("hi");

});
db_connect();
cloudinary_connect();