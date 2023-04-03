import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import Driver from "../model/Drivers.js";

import { driverUpdateValidation, registerationValidation,loginValidation } from "../validation.js";
//registeration
export const driverRegisteration = async (re, res, next)=>{
      const {name, email, phone_number} = req.body;

      const {error} = registerationValidation(req.body);
      if(error){
        return res.status(400).json({message: error.details[0].message});
       }
      let checkDriver;
      try{
          checkDriver =  await Driver.findOne({email});
      }catch(err){
          console.log(err);
      }
      if(checkDriver){
        res.status(400).json({message: "Email Already Exist"});
      }
     
      const hashPassword = bcrypt.hashSync(password);
      try{
         new Driver({
            name,
            email,
            phone_number,
            password: hashPassword ,
            role: "driver"
         });
      }catch(err){
        console.log(err)
      }
   
      return res.status(200).json({message: "Driver created"});
}
//login
export const driverLogin = async (req, res, next) =>{
    const {email, password} = req.body;
    const {error} = loginValidation(req.body);
   let isPasswordCorrect;
    if(error){
       return res.status(400).json({message: error.details[0].message});
    }
   let existingdriver;
   
   
   try{
    existingdriver = await Driver.findOne({ email });
   }catch(err){
     return console.log(err);
   }
   if (!existingdriver) {
     return res.status(404).json({message: "User Can Not Be Found"})
   }
   if(existingdriver.password){
    isPasswordCorrect = bcrypt.compareSync(password, existingdriver.password);
   }
    

   if(!isPasswordCorrect){
     return res.status(404).json({message: "Incorrect password"})
   }

   let payload = { id: existingdriver.id, user_type: existingdriver.role };
   const token = jwt.sign(payload, process.env.TOKEN_SECRET);
   
   return res.status(200).json({message: "Login Successful Done",token: token})
}

//update drivers details

export const updateDriversDetails = async (req, res, next)=>{
         const {name, phone_number} = req.body;

         const {error} = driverUpdateValidation(req.body);
         if(error){
            return res.status(400).json({message: error.details[0].message});
         }

}



