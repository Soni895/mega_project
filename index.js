const express=require("express");
const app=express();
require("dotenv").config();
const {db_connect}=require("./config/db_connect");
const port= process.env.port;
app.listen(port,()=>
{
    console.log("server startted successfully");
});
db_connect();