const { Mongoose } = require("mongoose");
const {instance}=require("../config/razorpay");
const Course= require("../models/course");
const User= require("../models/user");
const {MailSender}=require("../utils/mailsender");
const crypto = require('crypto');

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
    const {Course_Id}=req.body;
    const UserId=req.User.id;
    if(!Course_Id)
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
        Course_Id,
        User_id,
        course

    }
}

// function call order create
try {
    const PaymentResponse= await instance.orders.create(Option);
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
        status:"successful",
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
// verify signature of razor pay server
exports.VerifySignature= async (req,res)=>
{
    try {
        const payload = JSON.stringify(req.body);
        const webhookSecret = 'Amazon@45';
        const expectedSignature = req.headers['x-razorpay-signature'];
         const hmac = crypto.createHmac('sha256', webhookSecret);
         hmac.update(payload);
         const digest=hmac.dige("hex");

         if(expectedSignature===digest){
            console.log('Webhook signature verified');

            const {Course_Id,User_id}=req.body.payload.payment.entity.notes;

            try {
                // find the student and enroll it
                const Updated_User= await User.findByIdAndUpdate(User_id,
                    {
                        $push:{
                            Courses:Course_Id,
                        }
                    },{new:true});

                    if(!Updated_User)
                    {
                         return res.status(404).json({status:"unsuccessful",
                           success:false,
                         message:"user not update",

                    });
                }

                  
         // find the course and upade
 const Updated_Course= await Course.findByIdAndUpdate(Course_Id,
    {
        $push:{StudentEnrolled:User_id,}

    },{new:true})
                
            } catch (error) {
                res.status(400).json(
                    {
                        status:"unsuccessful",
                        success:false,
                        message:"Invalid webhook signature",
    
    
                    }
                );
                
            }
            if(!Updated_Course)
                    {
                         return res.status(404).json({status:"unsuccessful",
                           success:false,
                         message:"Courser not update",

                    });
                }


                // mail send 

                const email_response= await MailSender(Updated_User.Email,"congratulation",
                "payment successful congrtulation to our family");
            res.status(200).json(
                {
                    status:"successful",
                    success:true,
                    message:"user and course not update",
                    Updated_User,
                    Updated_Course,
                    email_response

                }
            );
         }
         else
         {
            console.log('Invalid webhook signature');
            res.status(400).json(
                {
                    status:"unsuccessful",
                    success:false,
                    message:"Invalid webhook signature",


                }
            );
         }

        
    } catch (error) {
        res.status(400).json(
            {
                status:"unsuccessful",
                success:false,
                message:"payment failed",
                error,

            }
        );

    }
}