// Otp,signup,login
// change password


const User=require("../models/user");
const Otp=require("../models/otp");
const otpGenerator = require('otp-generator');
const uniqid = require('uniqid');

exports.SendOtp=async(req, res)=>
{
    try {

    
    // fetch emial
    const {Email}=req.body;

    // check if user already exist
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
    console.log(isuniqueotp);
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
