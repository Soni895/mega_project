// Otp,signup,login
// change password
const User=require("../models/user");
const otp=require("../models/otp");
const Profile=require("../models/profile");
const otpGenerator = require('otp-generator');
const uniqid = require('uniqid');
const bcrypt=require("bcrypt");
require("dotenv").config();
const jwt= require("jsonwebtoken");
const jwt_secret=process.env.jwt_secret;

exports.SendOtp=async(req,res)=>
{
    try {
    // fetch emial
    const {Email}=req.body;

    // check if user already exist
    console.log(Email);
    const isprestent=await User.findOne({Email});
    // console.log(isprestent);
    if(isprestent)
    {
         return res.status(401).json(
            {
                status:false,
                message:"user exists",
            }
        )
    }

    // generate Otp
    // const uniqueId = uniqid();
    let Otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    })
    // +uniqueId;
    console.log("Otp=>",Otp);
    // console.log("uniqueId=>",uniqueId);
    // check unique Otp

    let isuniqueotp= await otp.findOne({Otp});
  
     console.log('isuniqueotp=>',isuniqueotp);

    while(isuniqueotp)
    {
         Otp = otpGenerator.generate(6, { digits: true })
        //  +uniqueId;
         isuniqueotp = await Otp.findOne({Otp:Otp});
    }

    const otpPayload={Email,Otp};
    const response= await otp.create(otpPayload);
    console.log("response=>",response);
    res.status(200).json(
        {
            status:true,
            response,
            Otp,
            otpPayload,
            // uniqueId,
            message:"Otp send Successful",
        }
    )

    
} catch (error) {
    res.status(500).json(
        {
            status:false,
            message:"Otp send Unsuccessful",
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
        // find most recet Otp 
        // password hashed
        // save in db
        const {
            AccountType,
            Email,FirstName,
            LastName,
            Password,
            ContactNumber,
            Otp,
            ConfirmPassword
        }=req.body;
console.log( AccountType,
    Email,FirstName,
    LastName,
    Password,
    ContactNumber,
    Otp,
    ConfirmPassword);
        if( 
            !Email|| 
            !FirstName||
            !LastName||
           
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
            console.log(isUserPresent);
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

            const recentotp = await otp.find({ Email }).sort({ CreateAt: -1 }).limit(1);


            console.log("recentotp =>",recentotp); 
            if(recentotp.length===0)
            {
                return res.status(400).json({
                    success:false,
                    status:"Unsuccessful",
                    message:"user not found please signup"
                });
            }else if(Otp!==recentotp[0].Otp)
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

            console.log("hashedpassword=>",hashedpassword);
            const profile= await Profile.create({
                ContactNumber:null,
                About:null,
                DateOfBirth:null,
                Gender:null
            });
            console.log("profile=>",profile);
            const Payload= new User(
                {
                    AccountType,
                    Email,FirstName,
                    LastName,
                    Image:`https://api.dicebear.com/5.x/initials/svg?seed=${FirstName} ${LastName}`,
                    Password:hashedpassword,
                    ContactNumber,
                    AdditionalDetails:profile._id,
                  
                }
            );

            console.log("Payload=>",Payload);

         
           const response= await Payload.save();

            console.log("response=>",response);
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
             
              let token=jwt.sign(payload,jwt_secret,
                {
                    expiresIn:"2h",
                });

                // user=user.toObject();
                user.Token=token;
                user.Password=undefined;
                console.log(user);
                

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

                    });


        
    } catch (error) {
        return res.status(500).json(
            {
                status:false,
                message:" Login fail please try again",
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

 console.log("request data=>",OldPassword,NewPassword,ConfirmNewPassword,Token);

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
    console.log("payload=>",payload);
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
    console.log(_id);
    const response =await User.findById(_id);
    console.log(response);
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
        console.log("hashedpassword=>",hashedpassword); 
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
    
    const updated_data=await User.findByIdAndUpdate(_id,{
        Password:hashedpassword,
    },{ new: true });
    console.log("updated_data=>",updated_data);

    return res.status(200).json(
        {
            Status:true,
            message:"Password change successfull",
            response,
            Token,
            updated_data,
            hashedpassword,
            ismatch,
            payload,

    
        }
    );  
        
    } catch (error) {
        return res.status(500).json(
            {
                status:"unsuccessful",
                success:false,
                error:" password change unsuccessful",
            });
        
    }
}
