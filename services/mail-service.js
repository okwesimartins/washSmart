import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import smtpTransport from 'nodemailer-smtp-transport';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
export const sendmail = async (receiver, otp) =>{
    const transporter = nodemailer.createTransport({
      host: 'achan.ng',
      port: 465,
      auth: {
        user: 'airporttaxi@achan.ng',
        pass: 'watchout101'
      },
      tls: {
        rejectUnauthorized: false
    }
      });
     
      const mailOptions = {
        from: 'airporttaxi@achan.ng',
        to: receiver,
        subject: 'OTP From washSmart this is to validate your account',
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">washSmart</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing smartWash . Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />washSmart</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Your Brand Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
        </div>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        }
         
         
        
      }); 

  
}




export const sendOrderSummary = async (receiver, bookingdata, amount, orderNumber, booking_time) =>{

  console.log(amount);
  const transporter = nodemailer.createTransport({
      host: 'achan.ng',
      port: 465,
      auth: {
        user: 'airporttaxi@achan.ng',
        pass: 'watchout101'
      },
      tls: {
          rejectUnauthorized: false
      }
    });
    ejs.renderFile(__dirname + '/templates/receipt.ejs', { receiver,  bookingdata, amount, orderNumber, booking_time }, (err, data) => {
          if(err){
            console.log(err);
          }else{
            const mailOptions = {
              from: 'airporttaxi@achan.ng',
              to: receiver,
              subject: 'OTP from washSmart',
              html: data
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              }
               
               
              
            }); 
          }
    });
   


}