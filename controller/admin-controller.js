import jwt from "jsonwebtoken";
import Location from "../model/Location.js";
import User from "../model/User.js";
import Admin from "../model/Admin.js";
import Booking from "../model/Booking.js";
import Drivers from "../model/Drivers.js";
import bcrypt from 'bcryptjs';
import { loginValidation } from "../validation.js";

//admin login
export const adminLogin = async (req, res, next) => {
    const {email, password} = req.body;
    const {error} = loginValidation(req.body);
    let isPasswordCorrect;
    if(error){
       return res.status(400).json({message: error.details[0].message});
    }
   let existinguser;
   
   
   try{
     existinguser = await Admin.findOne({ email });
   }catch{
     return console.log(err);
   }
   if (!existinguser) {
     return res.status(404).json({message: "User Can Not Be Found"})
   }
   if(existinguser.password){
    isPasswordCorrect = bcrypt.compareSync(password, existinguser.password);
   }
    

   if(!isPasswordCorrect){
     return res.status(404).json({message: "Incorrect password"})
   }

   let payload = { id: existinguser.id, user_type: existinguser.role };
   const token = jwt.sign(payload, process.env.TOKEN_SECRET);
   
   return res.status(200).json({message: "Login Successful Done",token: token})

}
//update admin profile
export const updateAdminPhonenumber =  async (req, res, next)=>{
             const phone_number = req.body.phone_number;
             const id = req.user.id;
             let checkadmin;
             let admin;
             try{
               checkadmin = Admin.findById(id)
             }catch(err){
                 console.log(err);
             }
            if(!checkadmin){
                return res.status(400).json({message: "Provide a valid token"})
            }
             try{
                admin = Admin.findByIdAndUpdate(id,{
                   phone_number
                })
             }catch(err){
                console.log(err);
             }
             return res.status(200).json({message: "Updated successfully"})

}
//admin add location
export const inputWashsmartLocation = async (req, res, next)=>{
         const name = req.body.location;
         let checklocation;

         try{
           checklocation = await Location.findOne({name});
         }catch(err){
           console.log(err);
         }
         if(checklocation){
            return res.status(400).json({message: "Location already exists"})
         }
        const location= new Location({
                name
         }); 
         try{
           location.save();
         }catch(err){
            console.log(err)
         }
         return res.status(200).json({message: "Location Added"})
}

//admin suspend a location
export const suspendActivateLocation = async (req, res, next)=>{
             const id = req.params.id;
              let checkLocation;
             try{
              checkLocation = await Location.findById(id);
             }catch(err){
              console.log(err)
             }
             if(!checkLocation){
                  return res.status(400).json({message: "No Location Found"})
             }
             
             if(checkLocation.status == "active"){
                await Location.findByIdAndUpdate(id,{
                   status:"inactive"
                 })
                  return res.status(200).json({message: "Suspended"})
             }else{
              await Location.findByIdAndUpdate(id,{
                status:"active"
              })
               return res.status(200).json({message: "Activated"})
             }


}
//update password
export const updateAdminPassword = async (req,res,next)=>{
  const {oldpassword, newpassword, confirmpassword} = req.body;

  const userid= req.user.id;
  let user;
  let isPasswordCorrect;
  if(newpassword == confirmpassword){
   try{
     user = await Admin.findById(userid)
 }catch(err){
    console.log(err);
 }
 if(!user){
 return res.status(400).json({message: "unable to update"})
 }

 if(user.password){
   isPasswordCorrect = bcrypt.compareSync(oldpassword, user.password);
 }
  if(!isPasswordCorrect){
 return  res.status(400).json({message: "Incorrect password"})
  }else{
   const newPassword = bcrypt.hashSync(newpassword);
   try{
    await Admin.findByIdAndUpdate(userid,{
       password:newPassword,          
      });
   }catch(err){
      console.log(err)
   }
    
    
    res.status(200).json({message: "updated successfully"});
  }
  }else{
   res.status(400).json({message: "new password is not equal to confirm password"})
  }

}
//admin get all location

export const getAllLocation = async (req, res, next)=>{
            let allLocation;
            try{
              allLocation = await Location.find();
            }catch(err){
              console.log(err);
            }
            if(!allLocation){
              return res.status(400).json({message:"No location set yet"})
            }

            return res.status(200).json(allLocation);
}

//get total users
export const getAllUsers = async (req, res, next)=>{
           let allUser;
           try{
              allUser = await User.find();
           }catch(err){
               console.log(err);
           }

           return res.status(200).json(allUser);
}