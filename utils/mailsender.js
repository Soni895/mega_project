const nodemailer= require("nodemailer");
require("dotenv").config();
const MailSender= async (email,title,body)=>  
{
  console.log(email,title,body);
  console.log("mail_host:", process.env.mail_host);
console.log("mail_user:", process.env.mail_user);
console.log("mail_pass:", process.env.mail_pass);


     try {
        let transporter = nodemailer.createTransport({
            host: process.env.mail_host,
            auth: {
              user: process.env.mail_user,
              pass: process.env.mail_pass,
            },
          });
          console.log("transporter =>",transporter);
          
          // Create an email message
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
        return error;
     }
}

module.exports=MailSender;