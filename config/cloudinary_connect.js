const cloudinary = require('cloudinary').v2
require("dotenv").config();
const  api_secret=process.env.api_secret;
const  api_key=process.env.api_key;
const cloud_name=process.env.cloud_name;


exports.cloudinary_connect=async()=>
{
console.log( api_secret,
    api_key,
    cloud_name);
    try {
         await cloudinary.config(
            {
                api_secret,
                api_key,
                cloud_name
            }
        );
        console.log("Cloudinary connection successful");
       
    } catch (error) {
        console.error("Cloudinary connection unsuccessful");
        console.error(error);
        process.exit(1);
        
    }
}