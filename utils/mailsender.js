const nodemailer=require("nodemailer");
require("dotenv").config();
const MailSender= async (mail,title,body)=>  
{
     try {
        const transporter = nodemailer.createTransport({
            host: process.env.mail_host,
            auth: {
              user: process.env.mail_user,
              pass: process.env.mial_pass,
            },
          });

          const mailOptions = {
            from: `darshan soni`, // Sender's email address
            to: mail,                 // Recipient's email address
            subject: title,           // Email subject
            text: body,              // Email body (plain text)
           
          };
          const info= await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }}
            );
            console.log(info);
            return info;
        
     } catch (error) {
        console.log(error);
     }
}

module.exports=nodemailer;