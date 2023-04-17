import User from "../model/User.js";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import { registerationValidation, loginValidation, forgotpasswordValidation } from "../validation.js";
import axios from "axios";
import bcrypt from 'bcryptjs';

const oauth2Client = new google.auth.OAuth2(
    '454924869328-m14q0u1deaca3b921vm69jevpth1tv1m.apps.googleusercontent.com',
    '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',
    'https://washsmart.onrender.com/api/user/google/auth'
);
export const generateGoogleurl = async (req, res, next) => {
   
  
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ];
      try{
        const result =oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: scopes, // If you only need one scope you can pass it as string
          });
          return res.json({message: result})
      }catch(err){
        console.log(err);
      }
    


}


 const getGoogleuser = async ({code})=>{
    const { tokens } = await oauth2Client.getToken(code);

    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.id_token}`,
          },
        },
      )
      .then(res => res.data)
      .catch(error => {
        throw new Error(error.message);
      });
  
    return googleUser;
}

//get google location
export const getLocation = async (req, res, next) =>{
    const location = req.body.location;
    const cleanedData = location.replace(' ','%20');
    if(!location){
      return res.status(400).json({message: "All fields are required"})
     }
    const googleLocation = await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${cleanedData}&components=country:ng&key=AIzaSyAN4lc1-JLSGrY97rGNQ9RpiQAoq3KuRbg`,
    
    )
    .then(res => res.data)
    .catch(error => {
      throw new Error(error.message);
    });
   
   const array =[];
   const prediction = googleLocation.predictions;
   prediction.forEach(value=>{
        const filteredData = value.description;
        array.push(filteredData);
    })

    return res.status(200).json(array);
}
export const addGoogleuser = async (req, res, next)=> {
    const code = req.query.code;
    
    const googleauthUser = await getGoogleuser({ code: code });
    const email = googleauthUser.email;
    let existinguser;
    try{
        existinguser = await User.findOne({ email }); 
    }catch(err){
        return res.status(400).json({err})
    }

       if(existinguser){
        let payload = { id: existinguser.id, user_type: existinguser.role };
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);
        
        res.status(200).cookie('auth-token', token,{
           maxAge:2628002880,
           httpOnly: true,
           secure: false
        });
        
        res.redirect('https://unique-palmier-0476fb.netlify.app/');
      
  
       }else{
     
     const user = new User({
       name : googleauthUser.name,
       email: googleauthUser.email,
       role: "user",
       bookings: [],
    });
        try{
           user.save();
        }catch{
            console.log(err);
        }

        let payload = { id: user.id, user_type: user.role };
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);
        
        res.status(200).cookie('auth-token', token,{
           maxAge:2628002880,
           httpOnly: true,
           secure: false
        });
        
        res.redirect('https://unique-palmier-0476fb.netlify.app/');
       
       }
        
}






//signup user
export const signup = async (req, res, next) => {
        const {name, email, phone_number,password, code} = req.body;
        let checkuser;
      
        let checkNumber;

        try{
          checkNumber= await User.findOne({phone_number});
          }catch(err){
            console.log(err);
          }
        if(checkNumber){
          return res.status(200).json({message: "phone number already exists"});
        }
        
        if(code == process.env.APP_TOKEN){

            try{
               checkuser= await User.findOne({email})
            }catch{
                console.log(err);
            }

            if(checkuser){
                let payload = { id: checkuser.id, user_type: checkuser.role };
                const token = jwt.sign(payload, process.env.TOKEN_SECRET);

                return res.status(200).json({message: token});
            }else{
                const user = new User({
                    name,
                    email,
                    role: "user",
                    bookings:[],
                 });

                 try{
                      user.save();
                 }catch{
                    return res.status(400).json({message: "An error occured please try again"});
                 }

                 let payload = { id: user.id, user_type: user.role };
                 const token = jwt.sign(payload, process.env.TOKEN_SECRET);

                 return res.status(200).json({message: token})
            }
           

        
        }

    const {error} = registerationValidation(req.body);
    
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }

    try{
      checkuser= await User.findOne({ email })
   }catch{
       console.log(err);
   }

   if(checkuser){
  

       return res.status(200).json({message: "User Already exist"});
   }
        const hashPassword = bcrypt.hashSync(password);
        const user = new User({
            name,
            email,
            password:hashPassword,
            phone_number,
            role: "user",
            bookings: [],
         });
    

     try{
            user.save();
       }catch{
          return res.status(400).json({message: "An error occured please try again"});
       }
       let payload = { id: user.id, user_type: user.role };
       const token = jwt.sign(payload, process.env.TOKEN_SECRET);

       return res.status(200).json({token: token})

}

//login

export const login = async (req, res, next) => {
    const {email, password} = req.body;
    const {error} = loginValidation(req.body);
   let isPasswordCorrect;
    if(error){
       return res.status(400).json({message: error.details[0].message});
    }
   let existinguser;
   
   
   try{
     existinguser = await User.findOne({ email });
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

export const userDashboardApi =  async (req, res, next)=>{
        const userid = req.user.id;
       
         let user;
         try{
             user= await User.findById(userid);

         }catch(error){
            console.log(error);
         }
      //  return  res.status(200).json({user})
         if(!user){
          return res.status(400).json({message: "User not found"})
         }

         return res.status(200).json({user:{id :user.id, name: user.name, email: user.email, phone_number:user.phone_number,role: user.role, bookings: user.bookings}});
}


//update user info

export const updateUser = async (req, res, next)=>{
       const {name, phone_number} = req.body;
       const userid = req.user.id;
       let user;
       if(name && phone_number){
        try{
          user=  await User.findByIdAndUpdate(userid,{
              name,
              phone_number
            });
       }catch(err){
           console.log(err);
       }
    if(!user){
        res.status(400).json({message: "Unable to update user"})
    }
res.status(200).json({message:"User updated"});
       }else{
        res.status(200).json({message:"All fields are required"});
       }
      
}

//update password
export const updatePassword = async (req,res,next)=>{
         const {oldpassword, newpassword, confirmpassword} = req.body;

         const userid= req.user.id;
         let user;
         let isPasswordCorrect;
         if(newpassword == confirmpassword){
          try{
            user = await User.findById(userid)
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
           await User.findByIdAndUpdate(userid,{
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


//update phone number
export const updatePhonenumber = async (req, res, next)=>{
              const {phone_number} = req.body;
              const userid = req.user.id;
              let checkuser;
              try{
                 checkuser = await User.findById(userid);
              }catch(err){
                console.log(err);
              }
              if(!checkuser){
                return res.status(400).json({message: "unable to update phone-number"});
              }

              try{
                 await User.findByIdAndUpdate(userid,{
                     phone_number
                 });
              }catch(err){
                console.log(err);
              }

              return res.status(200).json({message: "phone-number updated"});

}

//forgot password

export const updatForgotPassword = async (req, res, next)=>{
          const {email, password, hash, otp} =  req.body;
          const key = 'hfbsybfuyerbdjshbdhsurhewiwecv';
          const {error} = forgotpasswordValidation(req.body);

           if(error){
              return res.status(400).json({message: error.details[0].message});
           }
          if(email && password && hash && otp){
            
            let [hashValue,expires] = hash.split(".");
            let checkUser;
            let data  = `${email}.${otp}.${expires}`;
            let newCalculatedHash = crypto.createHmac("sha256",key).update(data).digest("hex");
            // Match the hashes
            if(newCalculatedHash === hashValue){
              try{
                checkUser= await User.findOne({email});
             }catch(err){
               console.log(err);
             }
             if(!checkUser){
               return res.status(400).json({message: "No User Found With This Mail"})
             }else{
              const userid = checkUser.id;
              const hashPassword = bcrypt.hashSync(password);
              try{
                 await User.findByIdAndUpdate(userid,{
                    password : hashPassword
                  })
              }catch(err){
                console.log(err);
              }
              return res.status(200).json({message: "Password updated"})
             }
          
            }else{
              return res.status(400).json({message: "Fraud Detected"})
            }
         
          }
         
      return res.status(400).json({message: "All Fields Are Required"})
}

//update user delivery address
export const updateDeliveryAddress = async (req, res, next)=>{
           const address = req.body.location;
           const id = req.user.id;
           if(!address){
            return res.status(400).json({message: "All fields are required"})
           }
           let existinguser;
           try{
              existinguser = await User.findById(id);
           }catch(err){
            console.log(err);
           }
           if(!existinguser){
            return res.status(400).json({message: "No User With This Token Found"})
           }

           try{
            existinguser=  await User.findByIdAndUpdate(id,{
                location: address
              });
           }catch(error){
              console.log(error);
           }

           return res.status(200).json({message:existinguser})
          
}