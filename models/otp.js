const mongoose=require("mongoose");
const Otpchema=new mongoose.Schema(
    {
        Email:
        {
            type:String,
            required:true,

        },
        Otp:
        {
            type:String,
            required:true,

        },
        CreateAt:
        {
            type:Date,
            default:Date.now(),
            expires:5*60,
        }


    }

);
const Otp=mongoose.model("Otp", Otpchema);
module.exports=Otp;