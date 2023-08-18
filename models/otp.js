const mongoose=require("mongoose");
const MailSender=require("../utils/mailsender")
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

async function SendOtp(Email,otp)
{
    try {
        const title= "verification code";
      console.log(title);
        const response= await MailSender(Email,title,otp);
        console.log("response==>",response);
           return response;
    } catch (error) {
        console.log("error while sending mail\n",error);
        // throw error;
        
    }
};
OtpSchema.pre("save",async(next)=>
{
console.log(this.Email,this.Otp);
 const  response= await SendOtp(this.email,this.otp);
 console.log("response=>",response);
 next();
});

const Otp=mongoose.model("Otp", OtpSchema);
module.exports=Otp;