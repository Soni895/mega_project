const mongoose=require("mongoose");
const {MailSender}=require("../utils/mailsender")
const OtpSchema=new mongoose.Schema(
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

// a function to send mail

async function SendOtp(Email,Otp)
{
    try {
        const title= "verification code";
        
      
        const response= await MailSender(Email,title,Otp);
        console.log(response);
        return response;
    } catch (error) {
        console.log("error while sending mail",error);
        // throw error;
        
    }
};
OtpSchema.pre("save",async(next)=>
{
 const  response=  await SendOtp(this.email,this.otp);
 console.log(response);
 next();
})

const Otp=mongoose.model("Otp", OtpSchema);
module.exports=Otp;