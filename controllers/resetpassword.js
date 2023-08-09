const { exists } = require("../models/courseprogrss");
const User=require("../models/user");
const  MailSender=require("../utils/mailsender");


exports.ResetPassword= async (req,res)=>
{
try {
     // steps
    // getmail
    // validation 
    // check is exists
    // create token 
    // update user by token and expire time
    // link generate
    // send mail containing url

    const {Email}=req.body;
    const user=await User.findOne({email});
    if(!user)
    {
    return res.status(401).json(
        {
            status:false,
            message:"user not found",
        });
    }
    const Token= crypto.randomUUID();
    const updated_deatils=await User.findOneAndUpdate
    ({Email},
        {
            Token,ResetPasswordExpires:Date.now()+5*1000*60,
        },{new:true});

    const url=`http://localhost:3000/Update-Password/${Token}`;
    const resposne= await MailSender(Email,"passwordreset",url);
    return res.status(200).json(
        {
            status:true,
            message:"reste password link send successful",
            
        }
    )
    
} catch (error) {
    res.status(500).json(
        
        {
            status:false,
            error,
            message:"reset password failed"
        }
    )
}

}