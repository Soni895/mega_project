// Otp,signup,login
// change password
const User=require("../models/user");
const Otp=require("../models/otp");
const Profile=require("../models/profile");
const otpGenerator = require('otp-generator');
const uniqid = require('uniqid');
const bcrypt=require("bcrypt");
require("dotenv").config();
const jwt= require("jsonwebtoken");

exports.SendOtp=async(req,res)=>
{
    try {
    // fetch emial
    const {Email}=req.body;

    // check if user already exist
    console.log(Email);
    const isprestent=await User.findOne({Email});
    console.log(isprestent);
    if(isprestent)
    {
         return res.status(401).json(
            {
                status:false,
                message:"user exists",
            }
        )
    }

    // generate otp
    const uniqueId = uniqid();
    let otp = otpGenerator.generate(6, { digits: true })+uniqueId;
    console.log("otp=>",otp);
    console.log("uniqueId=>",uniqueId)
    // check unique otp

    let isuniqueotp= await Otp.findOne({Otp:otp});
     console.log('isuniqueotp=>',isuniqueotp);
     
    while(isuniqueotp)
    {
         otp = otpGenerator.generate(6, { digits: true })+uniqueId;
         isuniqueotp = await Otp.findOne({Otp:otp});
    }

    const otpPayload={Email,Otp:otp};
    const response= await Otp.create(otpPayload);
    console.log(response);
    res.status(200).json(
        {
            status:true,
            response,
            otp,
            otpPayload,
            uniqueId,
            message:"otp send Successful",
        }
    )

    
} catch (error) {
    res.status(500).json(
        {
            status:false,
            message:"otp send Unsuccessful",
            error,
        }
    )
    
}
}

// sign up fucntion

exports.SignUp= async (req,res)=>
{
    try {

        // data fetch
        // validdate 
        // 2nd password matchMediacheck user already exiss
        // find most recet otp 
        // password hashed
        // save in db
        const {
            AccountType,
            Email,FirstName,
            LastName,
            Image,
            Password,
            ContactNumber,
            Otp,
            ConfirmPassword
        }=req.body;
console.log( AccountType,
    Email,FirstName,
    LastName,
    Image,
    Password,
    ContactNumber,
    Otp,
    ConfirmPassword);
        if( 
            !Email|| 
            !FirstName||
            !LastName||
            !Image||
            !Password||
            !ContactNumber||
            !Otp||
            !ConfirmPassword)
            {
               return res.status(403).json(
                {
                    success:false,
                    status:"Unsuccessful",
                    message:"All field are required to fill"
                }
               ) 
            }

            if(Password!==ConfirmPassword)
            {
                return res.status(400).json(
                    {
                        success:false,
                        status:"Unsuccessful",
                        message:"Password and confirmPassword not match"
                    }
                )

            }
            const isUserPresent= await User.findOne({Email});
            if(isUserPresent)
            {
                return res.status(400).json(
                    {
                        success:false,
                        status:"Unsuccessful",
                        message:"existing user please login"
                    }
                )
            }

            const recentotp= await  Otp.find({
                Email,
            }).sort({
                CreatedAt:-1

            }).limit(1);
            console.log("recentotp =>",recentotp); 
            if(recentotp.length===0)
            {
                return{
                    success:false,
                    status:"Unsuccessful",
                    message:"Otp not found"
                }
            }else if(Otp!==recentotp)
            {
                return res.status(400).json(
                    {
                        success:false,
                        status:"Unsuccessful",
                        message:"Otp not match"
                    }
                )
            }
            let hashedpassword;
            try{
                hashedpassword= await bcrypt.hash(Password,10);
    
            }
            catch(error)
            {
                return res.status(400).json(
                    {
                        status:"error in hasing password",
                        success:false,
    
                    }
                )
            }
            const profile= await Profile.create({
                ContactNumber:null,
                About:null,
                DateOfBirth:null,
                Gender:null
            });
            const Payload= new User(
                {
                    AccountType,
                    Email,FirstName,
                    LastName,
                    Image:`https://api.dicebear.com/5.x/initials/svg?seed=${FirstName} ${LastName}`,
                    Password:hashedpassword,
                    ContactNumber,
                    AdditionalDetails:profile._id
                  
                }
            )

         
            const response= await Payload.save();
            return res.status(200).json(
                {
                    status:true,
                    message:"user Signup successful",
                    response,
                    Payload,
                    hashedpassword,
 
                }
            )
        
    } catch (error) {
        return res.status(500).json(
            {
                status:false,
                message:"try again",
              error,
            }
        )
        
    }
    
}

exports.Login= async (req,res)=>
{
// get data form req
// validation
// user check exists
// password match
// generate jwt token
// create cookee

    try {
        const {Email,Password}=req.body;

        if(!Email||!Password)
        {
            return res.status(500).json(
            {
                    status:"unsuccessful",
                    success:false,
                    error:"Empty field please fill all required field",
                }); 
            }
            let user = await User.findOne({Email}).populate("AdditionalDetails");
            if(!user)
            {
                return res.status(500).json(
                        {
                            status:"unsuccessful",
                            success:false,
                            error:"user  not found",
                        });
              }
              const ismatch= await bcrypt.compare(Password,user.Password);
              if(!ismatch)
              {
                 return  res.status(500).json(
                      {
                          status:"unsuccessful",
                          success:false,
                          error:"password not match",
                      }); 
              }
              const payload=
              {
                  Email:user.Email,
                  id:user._id,
                  Role:user.AccountType
  
              }
              const jwt_secret=process.env.jwt_secret;
              let token=jwt.sign(payload,jwt_secret,
                {
                    expiresIn:"2h",
                });

                // user=user.toObject();
                user.Token=token;
                console.log(user.Token);
                user.Password=undefined;

                const options={
                    expires:new Date( Date.now()+3*24*60*60*1000),
                   httpOnly:true,

                }
                res.cookie("Token",token,options).status(200).json(
                    {
                        status:"successful",
                        token,
                        user,
                        message:"successful login",
                        Email,
                        Password,

                    });


        
    } catch (error) {
        return res.status(500).json(
            {
                status:false,
                message:"try again",
                  error,
            }
        )
    }
}

// todo homework
exports.ChangePassword= async (req,res)=>
{
    try {
        // get data from user
    // old password new password
    // confirm new password
    // validation 
    // update password in database
    // send mail update password
    // return response
    const {OldPassword,NewPassword,ConfirmNewPassword}=req.body;
    const {Token}=req.body||req.cookies ||
 req.header("Authorization").replace("Bearer ","");

 if(!Token)
 {
     return res.status(500).json(
         {
             status:"unsuccessful",
             success:false,
             error:" token not found",
         });
 }


    const payload=jwt.verify(Token,process.env.jwt_secret);
    if(!payload)
    {
        return res.status(500).json(
            {
                status:"unsuccessful",
                success:false,
                error:" paylaod not found",
            });
    }
    const _id=payload.id;
    const response =await User.findById(_id);
    if(!response){
        return res.status(500).json(
            {
                status:"unsuccessful",
                success:false,
                error:" User not found",
            });

    }
    const ismatch=bcrypt.compare(OldPassword,response.Password);
    if(!ismatch)
    {
       return  res.status(500).json(
            {
                status:"unsuccessful",
                success:false,
                error:"password not match",
            }); 
    }

    if(ConfirmNewPassword!==NewPassword)
    {
        return res.status(500).json(
            {
                status:"unsuccessful",
                success:false,
                error:" Password and confirm Password not Match",
            });

    };
    let hashedpassword;
    try{
        hashedpassword= await bcrypt.hash(NewPassword,10);
        const updated_data=await User.findByIdAndUpdate(_id,{
            Password:hashedpassword,
        },{ new: true });

        return res.status(200).json(
            {
                Status:true,
                message:"Password change successfull",
                response,
                hashedpassword,
                NewPassword,OldPassword,Password,
                ismatch,
                payload,
                Token
            }
        );   
    }
 
    
   catch(error)
    {
        return res.status(400).json(
            {
                status:"error in hasing password",
                success:false,

            }
        )
    }
    
        
    } catch (error) {
        return res.status(500).json(
            {
                status:"unsuccessful",
                success:false,
                error:" password change unsuccessful",
            });
        
    }
}
