
import crypto from 'crypto';
import otpGenerator from 'otp-generator';
import { sendmail } from '../services/mail-service.js';
const key = 'hfbsybfuyerbdjshbdhsurhewiwecv';
export const generateOtp = async (req, res, next)=>{
      // Generate a 6 digit numeric OTP
    const receiver= req.params.email;
    const otp      = `${Math.floor(1000 + Math.random() * 9000)}`;
    const ttl      = 5 * 60 * 1000; //5 Minutes in miliseconds
    const expires  = Date.now() + ttl; //timestamp to 5 minutes in the future
    const data     = `${receiver}.${otp}.${expires}`; // phone.otp.expiry_timestamp
    const hash     = crypto.createHmac("sha256",key).update(data).digest("hex"); // creating SHA256 hash of the data
    const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
    // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
    

    const {message}= sendmail(receiver, otp);
    console.log(receiver);
    return res.status(200).json({encrypted_data: fullHash, message:message});
    

}

export const validateOtp = (req, res, next) => {
      const {email,otp, hash}  = req.body;

      if(email && otp && hash){
        let [hashValue,expires] = hash.split(".");
      // Check if expiry time has passed
      let now = Date.now();
      if(now>parseInt(expires)){
        return res.status(400).json({
          message: "OTP expired",
    
        });
      }
      // Calculate new hash with the same key and the same algorithm
      let data  = `${email}.${otp}.${expires}`;
      let newCalculatedHash = crypto.createHmac("sha256",key).update(data).digest("hex");
      // Match the hashes
      if(newCalculatedHash === hashValue){
          return res.status(200).json({
              message: "Valid"
          });
      } 
      return res.status(400).json({
            message: "An error occured kindly try again"
      });
      }else{
        return res.status(400).json({
          message: "All fields are required"
    });
      }
      
}
