const { Mongoose } = require("mongoose");
const {instance}=require("../config/razorpay");
const Course= require("../models/course");
const User= require("../models/user");
const {MailSender}=require("../utils/mailsender");

// import template for email sender
// after integrate template



//   capture the payment and initiate therazor pay mdoel

exports.CapturePayment=async (req,res)=>
{
    try {
        // get course in and userid
    // validation
    // is valid course id 
    // is valid user id
    // user alraedy pay for that
    //order craete
    // return response
    const {CourseId}=req.body;
    const UserId=req.User.id;
    if(!CourseId)
    {
        return res.status(401).json({
            success:false,
            status:"Unsuccessful",
            message:"please provide valid course id",
            
        });
    }
    // check valid course detailes
    let course= await Course.findById(CourseId);
    if(!course)
    {
        return res.status(401).json({
            success:false,
            status:"Unsuccessful",
            message:"Course Not found",
            
        });

    } 
     // check user alraedy pay for that

       // convert into  object id
 const User_id= new Mongoose.Types.ObjectId(UserId);
if(Course.StudentEnrolled.include(User_id))
{
    return res.status(401).json({
        success:false,
        status:"Unsuccessful",
        message:"student already enrolled into the course",
        
    });
}
// order create
const Amount=Course.Price;
const Currency="INR";

const Option={
    amount:Amount*100,
    currency:Currency,
    receipt:Math.random().toString(),
    notes:
    {
        CourseId,
        User_id,
        course

    }
}

// function call order create
try {
    const PaymentResponse= await  instance.orders.create(Option);
console.log(PaymentResponse);
} catch (error) {
    return res.status(401).json({
        success:false,
        status:"Unsuccessful",
        message:"order not initiate",
        error,
        
    });   
}

// return response
return res.status(200).json(
    {
        status:success,
        success:true,
        message:"order craeted successfully",
        PaymentResponse,
        course,
       order_id:PaymentResponse.id,
       amount:PaymentResponse.amount, 

    }
)



    } catch (error) {
        return res.status(500).json(
            {
                status:"Unsuccessful",
                success:false,
                error,
                message:"Create order failed",
            }
        )
    }

}