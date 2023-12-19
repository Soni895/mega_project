const { Mongoose, default: mongoose } = require("mongoose");
const {instance}=require("../config/razorpay");
const Course= require("../models/course");
const User= require("../models/user");
const MailSender=require("../utils/mailsender");
const crypto = require('crypto');
const {CourseEnrollmentEmail}= require("../Mail-Template/CourseEnrollmentEmail");
const {PaymentSuccessEmail}= require("../Mail-Template/PaymentSuccessEmail");
// import template for email sender
// after integrate template
//   capture the payment and initiate therazor pay mdoel



// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.User.id;
    console.log( orderId, paymentId, amount);
  
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
  
    try {
      const EnrolledStudent = await User.findById(userId);
  
    const Mail_Respose= await MailSender(
        EnrolledStudent.Email,
        `Payment Successful`,
        PaymentSuccessEmail(
          `${EnrolledStudent.FirstName+" "+EnrolledStudent.LastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      );

      console.log("Mail_Respose=>",Mail_Respose);
      return res.status(200).json({
        status:true,
        success:true,
        Mail_Respose
      })
    } catch (error) {
      console.log("error in sending mail", error)
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" })
    }
  }
  
exports.CapturePayment=async (req,res)=>{
    try {

        const {Courses}= req.body;
        const UserId= req.User.id;

        console.log("courses and userId=>",Courses,UserId);

        if(Courses.length===0)
        {
           return  res.status(500).json(
                {
                    status:false,
                   message:"please provide Course Id"
                }
            )
        }

        let TotalAmount=0;

        
       for(const Course_Id of Courses )
        {

            console.log(Course_Id);
            let course;
            try {
                course = await Course.findById(Course_Id);
                console.log("Course=>",course);

                if(!course)
                {
                    return res.status(500).json(
                        {
                            status:false,
                            message:"course not found"
                        }
                    )
                }

                const Uid= new mongoose.Types.ObjectId(UserId);
                console.log("Uid id=>",Uid);

                if(course.StudentEnrolled.includes(Uid))
                {
                    return res.status(500).json(
                        {
                            status:false,
                            message:"student is already enrolled"
                        }
                    )
                }


                TotalAmount+=course?.Price;
                console.log("TotalAmount=>",TotalAmount);

            } catch (error) {

                return res.status(500).json(
                    {
                        status:false,
                        message:"error in calculating Course Price"
                    }
                )
                
            }
         }
          // order create

       
  const Currency="INR";

const Option={
    amount:TotalAmount*100,
    currency:Currency,
    receipt:Math.random(Date.now()).toString(),
    notes:
    {
       
        UserId,
    }
}
console.log("Option=>",Option);
// creatting order
try {

const PaymentResponse= await instance.orders.create(Option);

console.log("paymentResposne=>",PaymentResponse);
return res.status(200).json({
    success:true,
    message:"payment response successful",
    PaymentResponse,

})

    
} catch (error) {
 return  res.staus(500).json(
        {

            staus:false,
            message:"unable to get payment response",
            error,

        }
    )
}

        
    } catch (error) {

       return  res.status(500).json(
            {
                staus:false,
                message:"unable to Capture Payment ",
                error,
    
            }
        )
        
    }
}

async function SendCourseMail(Email,CourseName,Name)
{
    try {
        const title= "Successful CourseEnrollment";
     
        const response= await MailSender(Email,title,CourseEnrollmentEmail(CourseName,Name));
        console.log("response 133==>",response);
           return response;
    } catch (error) {
        console.log("error while sending mail\n",error);
        throw error;
        
    }
};

const EnrollStudent= async(courses,userid,res)=>{
    if(!courses||!userid)
    {
       return  res.status(400).json({
            success:false,
            message:'please provide complete detailes'
        })
    }

    for (const CourseId of courses)
    {
       try {

        const EnrolledCourse= await Course.findOneAndUpdate (CourseId,
            {
                $push: {
                    StudentEnrolled: userid,
                  },
                
            },{new:true});

    if(!EnrolledCourse)
    {
       return res.status(400).json({
            success:false,
            message:'Course not found'
        })
    }

    // find student and enroll into the course

        const EnrolledStudent= await User.findByIdAndUpdate(userid,{
            $push:{
                Courses:CourseId
            }
        },{new:true});


        // send the enroll student mail

        const EmailResponse= await SendCourseMail(EnrolledStudent.Email,EnrolledCourse.CourseName,EnrolledStudent.FirstName+" "+EnrolledStudent.LastName);
      console.log("email send successful EmailResponse==>", EmailResponse);

       return res.status(200).json(
                {
                    staus:true,
                    success:true,
                    message:"payment verified successfully"
                }
            )
        
       } catch (error) {
        
        return res.status(400).json({
            success:false,
            message:'Course not found',
            error,
        })
       }
    }


}

exports.VerifySignature= async(req,res)=>
{
    try {

        const razorpay_order_id= req.body?.razorpay_order_id;
        const razorpay_payment_id= req.body?.razorpay_payment_id;
        const razorpay_signature= req.body?.razorpay_signature;

        const courses= req.body.Courses;
        const userid= req.User.id;

        console.log("razorpay_order_id,razorpay_payment_id,razorpay_signature,courses,userid=>",
        razorpay_order_id,razorpay_payment_id,razorpay_signature,courses,userid)

        if(!razorpay_order_id ||!razorpay_payment_id||!razorpay_signature ||!courses||!userid)
        {
            return res.status(500).json(
                {
                    status:false,
                    message:"payment failed",
                }
            )
        }

        let body=razorpay_order_id+"|"+razorpay_payment_id;
        const expectedSignature= crypto.createHmac("sha256",Process.env.razorpay_key_secret)
        .update(body.toString()).digest("hex");

        if(expectedSignature===razorpay_signature)
        {
            // student need to be enrolled

            await EnrollStudent(courses,userid,res);

    
        }

        return res.status(500).json(
            {
                staus:false,
                success:false,
                message:"payment verified failed"
            }
        )
 
    } catch (error) {
        return res.status(500).json(
            {
                staus:false,
                success:false,
                message:"error in payment verified ",
                error
            }
        )
        
    }

}

// exports.CapturePayment=async (req,res)=>
// {
//     try {
//         // get course in and userid
//      // validation
//     // is valid course id 
//     // is valid user id
//     // user alraedy pay for that
//     //order craete
//     // return response
//     const {Course_Id}=req.body;
//     const UserId=req.User.id;
//     if(!Course_Id)
//     {
//         return res.status(401).json({
//             success:false,
//             status:"Unsuccessful",
//             message:"please provide valid course id",
            
//         });
//     }
//     // check valid course detailes
//     let course= await Course.findById(Course_Id);
//     if(!course)
//     {
//         return res.status(401).json({
//             success:false,
//             status:"Unsuccessful",
//             message:"Course Not found",
            
//         });

//     } 
//      // check user alraedy pay for that

//        // convert into  object id
//  const User_id= new Mongoose.Types.ObjectId(UserId);
// if(Course.StudentEnrolled.include(User_id))
// {
//     return res.status(401).json({
//         success:false,
//         status:"Unsuccessful",
//         message:"student already enrolled into the course",
        
//     });
// }
// // order create
// const Amount=course.Price;
// const Currency="INR";

// const Option={
//     amount:Amount*100,
//     currency:Currency,
//     receipt:Math.random().toString(),
//     notes:
//     {
//         Course_Id,
//         User_id,
//         course

//     }
// }

// // function call order create
// try {
//     const PaymentResponse= await instance.orders.create(Option);
// console.log(PaymentResponse);
// } catch (error) {
//     return res.status(401).json({
//         success:false,
//         status:"Unsuccessful",
//         message:"order not initiate",
//         error,
        
//     });   
// }

// // return response
// return res.status(200).json(
//     {
//         status:"successful",
//         success:true,
//         message:"order craeted successfully",
//         PaymentResponse,
//         course,
//        order_id:PaymentResponse.id,
//        amount:PaymentResponse.amount, 

//     }
// )



//     } catch (error) {
//         return res.status(500).json(
//             {
//                 status:"Unsuccessful",
//                 success:false,
//                 error,
//                 message:"Create order failed",
//             }
//         )
//     }

// }
// // verify signature of razor pay server
// exports.VerifySignature= async (req,res)=>
// {
//     try {
//         const payload = JSON.stringify(req.body);
//         const webhookSecret = 'Amazon@45';
//         const expectedSignature = req.headers['x-razorpay-signature'];
//         const hmac = crypto.createHmac('sha256', webhookSecret);
//         hmac.update(payload);
//         const digest=hmac.dige("hex");

//          if(expectedSignature===digest){
//             console.log('Webhook signature verified');

//             const {Course_Id,User_id}=req.body.payload.payment.entity.notes;

//             try {
//                 // find the student and enroll it
//                 const Updated_User= await User.findByIdAndUpdate(User_id,
//                     {
//                         $push:{
//                             Courses:Course_Id,
//                         }
//                     },{new:true});

//                     if(!Updated_User)
//                     {
//                          return res.status(404).json({status:"unsuccessful",
//                            success:false,
//                          message:"user not update",

//                     });
//                 }

                  
//          // find the course and update
//            const   Updated_Course= await Course.findByIdAndUpdate(Course_Id,
//        {
//         $push:{StudentEnrolled:User_id,}

//        },{new:true})
                
//             } catch (error) {
//                 res.status(400).json(
//                     {
//                         status:"unsuccessful",
//                         success:false,
//                         message:"Invalid webhook signature",
    
    
//                     }
//                 );
                
//             }
//             if(!Updated_Course)
//                     {
//                          return res.status(404).json({status:"unsuccessful",
//                            success:false,
//                          message:"Courser not update",

//                     });
//                 }


//              // mail send 

//         const email_response= await MailSender(Updated_User.Email,"congratulation",
//                 "payment successful congrtulation to our family");
//             res.status(200).json(
//                 {
//                     status:"successful",
//                     success:true,
//                     message:"user and course not update",
//                     Updated_User,
//                     Updated_Course,
//                     email_response

//                 }
//             );
//          }
//          else
//          {
//             console.log('Invalid webhook signature');
//             res.status(400).json(
//                 {
//                     status:"unsuccessful",
//                     success:false,
//                     message:"Invalid webhook signature",


//                 }
//             );
//          }

        
//     } catch (error) {
//         res.status(400).json(
//             {
//                 status:"unsuccessful",
//                 success:false,
//                 message:"payment failed",
//                 error,

//             }
//         );

//     }
// }