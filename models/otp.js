const mongoose=require("mongoose");
const MailSender=require("../utils/mailsender");
const {OtpEmail}= require("../Mail-Template/EmailVerificationTemplate");
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
            default:Date.now,
           
            expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
        }
    }
);

// a function to send mail

async function SendOtp(Email,otp)
{
    try {
        const title= "Verification Email";
     
        const response= await MailSender(Email,title,OtpEmail(otp));
        console.log("response==>",response);
           return response;
    } catch (error) {
        console.log("error while sending mail\n",error);
        throw error;
        
    }
};
OtpSchema.pre("save",async function (next)
{
    // console.log(this);
    // Only send an email when a new document is created
    console.log(this.isNew);
    if(this.isNew)
    {
    const response= await SendOtp(this.Email,this.Otp);
     console.log("response=>",response);

    }
 

 next();
});

const Otp=mongoose.model("Otp", OtpSchema);

module.exports=Otp;
