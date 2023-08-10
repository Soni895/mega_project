const nodemailer=require("nodemailer");
require("dotenv").config();
const MailSender= async (mail,title,body)=>  
{

     try {
      
      // const mail_host=process.env.mail_host;
      // const mail_user=process.env.mail_user;
      // const mail_pass=process.env.mail_pass;
      // console.log(mail_host,mail_pass,mail_user);
        const transporter = nodemailer.createTransport({
            host: process.env.mail_host,
            auth: {
              user: process.env.mail_user,
              pass: process.env.mial_pass,
            },
          });
          console.log(transporter);

          const mailOptions = {
            from: `darshan soni`, // Sender's email address
            to: mail,                 // Recipient's email address
            subject: title,           // Email subject
            text: body,              // Email body (plain text)
           
          };
          const info= await transporter.sendMail(mailOptions
          // , (error, info) => {
          //   if (error) {
          //     console.error('Error sending email:', error);
          //   } else {
          //     console.log('Email sent:', info.response);
          //   }}
            );
            console.log(info);
            return info;
        
     } catch (error) {

        console.log(error);
     }
}

module.exports=MailSender;