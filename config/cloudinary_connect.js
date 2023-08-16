const cloudinary = require('cloudinary').v2
require("dotenv").config();
const  api_secret=process.env.api_secret;
const  api_key=process.env.api_key;
const cloud_name=process.env.cloud_name;

exports.cloudinary_connect=()=>
{
    try {
        cloudinary.config(
            {
                api_secret,
                api_key,
                cloud_name
            }
        );
       
    } catch (error) {
        console.log(error)
        
    }
}