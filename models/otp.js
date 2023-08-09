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

async function SendOtp(email,otp)
{
    try {
        const title= "verification code";
        
      
        const response= await MailSender(email,title,otp);
        console.log(response);
    } catch (error) {
        console.log("error while sending mail",error);
        throw error;
        
    }
};
OtpSchema.pre("save",async(next)=>
{
   await  SendOtp(this.email,this.otp);
   next();
})

const Otp=mongoose.model("Otp", OtpSchema);
module.exports=Otp;