const nodemailer= require("nodemailer");
require("dotenv").config();
const MailSender= async (email="darshansoni895@gmail.com",title,body=123455)=>  
{
  console.log(email,title,body);

     try {
        let transporter = nodemailer.createTransport({
            host: process.env.mail_host,
            auth: {
              user: process.env.mail_user,
              pass: process.env.mail_pass,
            },
          });
          console.log("transporter =>",transporter);

          let MailOptions = {
            from: `darshan soni`, // Sender's email address
            to: email,                 // Recipient's email address
            subject: title,           // Email subject
            html: `${body}`,    // Email body 
           
          };
           const info= await transporter.sendMail(MailOptions);
            console.log("info=>",info);
            return info;
        
     } catch (error) {

      console.log("error to send email");
        console.log(error);
     }
}

module.exports=MailSender;