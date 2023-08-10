const User=require("../models/user");
const  MailSender=require("../utils/mailsender");
const bcrypt=require("bcrypt");

exports.ResetPasswordToken= async (req,res)=>
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
    const user=await User.findOne({Email});
    if(!user)
    {
    return res.status(401).json(
        {
            status:false,
            message:"user not found",
        });
    }
    const Token= crypto.randomUUID();
    const Updated_Deatils=await User.findOneAndUpdate({Email},
        {
            Token,ResetPasswordExpires:Date.now()+5*1000*60,
        },{new:true});

    const url=`http://localhost:3000/Update-Password/${Token}`;
    const resposne= await MailSender(Email,"passwordreset",url);
    return res.status(200).json(
        {
            status:true,
            message:"reste password link send successful",
            Updated_Deatils,
            Token,
            resposne,
            url, 
        }
    );
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

exports.ResetPAssword=async (req,res)=>
{
   try {
     //token
    // password
    // confirmpassword
    // get user detais
    // if entry not found ->invalid token
    // check expires time 
    // hash password 
    // update password
    const {Token,Password,ConfirmPassword}=req.body;
    if(Password!==ConfirmPassword)
    {
      return res.status(500).json(
        {
            status:false,
            message:"password not match",
            
        }
      );
    }
    const UserDetails=await User.findOne({Token});
    if(!UserDetails)
    
    {
        return res.status(500).json(
            {
                status:false,
                message:"password not match",
            }
          );
    }
    if(UserDetails.ResetPasswordExpires>Date.now())
    {
        return res.status(500).json(
            {
                status:false,
                message:"token is expire please regenertae password",
            }
          )
    }

    const hashedpassword= await bcrypt.hash(Password,10);

    const resposne= await User.findOneAndUpdate({Token},
        {Password:hashedpassword},
        {new:true})

        return res.status(200).json(
            
            {
                staus:true,
                message:"password reset successfull",
                resposne,

            }
        );
    
   } catch (error) {
    return res.status(500).json(
        {
            status:false,
            message:"password resset un successful please try again",
            error,
        }
    )
    
   }
}