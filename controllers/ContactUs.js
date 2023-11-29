
const MailSender=require("../utils/mailsender");
const {ContactUsEmail}= require("../Mail-Template/ContactFormRes");
exports.ContactUs= async (req,res)=>
{
    try {

        const {FirstName,LastName,Message,PhoneNo,CountryCode,Email}= req.body;
        
        const response= await MailSender(Email,"Your Data send successfully",ContactUsEmail(
            Email,
            FirstName,
            LastName,
            Message,
            PhoneNo,
            CountryCode
        ));

        console.log("response=>",response);
        return res.status(200).json(
            {
                message: "Email send successfully",
                status:true,
            }
        );

    } catch (error) {
        console.log(error);
        console.log("Error message :", error.message);
        return res.json({
            success: false,
            message: "Something went wrong...",
          })
        
    }

}