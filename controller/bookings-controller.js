import Booking from "../model/Booking.js";
import mongoose from "mongoose";
import Pricing from "../model/Pricing.js";
import Location from "../model/Location.js";
import User from "../model/User.js";
import axios from "axios";
import { sendOrderSummary } from "../services/mail-service.js";



  async function calculatePrice(req,res,next){
         const  booking_data =req.body.items;
        
         let amount= 0;
        
          const pricing = await Pricing.findOne({});
          
        booking_data.forEach(value => {
           
                if(value.service_type == "dry_cleaning"){
                    let data;
                     const category = value.cloth_category;
                     if(category == "top"){
                        data = pricing.dry_cleaning.top;
                     }
                     if(category == "bottom"){
                        data = pricing.dry_cleaning.bottom;
                     }
                     if(category == "full_body"){
                        data = pricing.dry_cleaning.full_body;
                     }
                     if(category == "house_hold"){
                        data = pricing.dry_cleaning.house_hold;
                     }
                     
                     
                     
                     const fields = Array.isArray('name') ? 'name' : ['name'];
                      const result = data.filter((item) => fields.some((field) => item[field] === value.cloth_name));
                      let finalprice;

                      result.forEach(value2 => {
                        finalprice= value2.pricing
                    });
                     const convert_to_number = Number(finalprice);
                 
                     const finalpriceAndQuantity = convert_to_number * Number(value.quantity)
                 amount += finalpriceAndQuantity;
                }else if(value.service_type == "wash_and_fold_one_time"){
                    const finalprice = pricing.wash_and_fold_one_time;
                    const convert_to_number = Number(finalprice);

                    const finalpriceAndQuantity = convert_to_number * Number(value.quantity)
                    amount += finalpriceAndQuantity;
                }
                else if(value.service_type == "wash_and_fold_smart_wash"){
                    const finalprice = pricing.wash_and_fold_smart_wash;
                    const convert_to_number = Number(finalprice);

                    const finalpriceAndQuantity = convert_to_number * Number(value.quantity)
                    amount += finalpriceAndQuantity;
                }
                else if(value.service_type == "wash_and_fold_smart_wash_yearly_plan_per_bag"){
                  const finalprice = pricing.wash_and_fold_smart_wash_yearly_plan_per_bag;
                  const convert_to_number = Number(finalprice);

                  const finalpriceAndQuantity = convert_to_number * Number(value.quantity)
                  amount += finalpriceAndQuantity;
              }
              else if(value.service_type == "wash_iron_and_fold_one_time"){
                  const finalprice = pricing.wash_iron_and_fold_one_time;
                  const convert_to_number = Number(finalprice);

                  const finalpriceAndQuantity = convert_to_number * Number(value.quantity)
                  amount += finalpriceAndQuantity;
              }
              else if(value.service_type == "wash_iron_and_fold_smart_wash_yearly_plan_per_bag"){
               const finalprice = pricing.wash_iron_and_fold_smart_wash_yearly_plan_per_bag;
               const convert_to_number = Number(finalprice);

               const finalpriceAndQuantity = convert_to_number * Number(value.quantity)
               amount += finalpriceAndQuantity;
           } else if(value.service_type == "wash_iron_and_fold_smart_wash"){
            const finalprice = pricing.wash_iron_and_fold_smart_wash;
            const convert_to_number = Number(finalprice);

            const finalpriceAndQuantity = convert_to_number * Number(value.quantity)
            amount += finalpriceAndQuantity;
        }
                else if(value.service_type == "ironing"){
                  let data;
                  const category = value.cloth_category;
                  if(category == "top"){
                     data = pricing.ironing.top;
                  }
                  if(category == "bottom"){
                     data = pricing.ironing.bottom;
                  }
                  if(category == "full_body"){
                     data = pricing.ironing.full_body;
                  }
                  if(category == "native_wear"){
                     data = pricing.ironing.native_wear;
                  }
                  
                 
                  
                  const fields = Array.isArray('name') ? 'name' : ['name'];
                   const result = data.filter((item) => fields.some((field) => item[field] === value.cloth_name));
                   let finalprice;

                   result.forEach(value2 => {
                     finalprice= value2.pricing
                 });
                  const convert_to_number = Number(finalprice);
              
                  const finalpriceAndQuantity = convert_to_number * Number(value.quantity)
              amount += finalpriceAndQuantity;
              }
        });

        return amount;

}

export const getTotalamount = async (req, res, next)=>{
   //validate array
   
  const totalAmount = await calculatePrice(req, res, next);

  return res.status(200).json({totalAmount});
}

export const createRequest = async (req, res, next)=> {
   const bookingdata = req.body.items;
   const pickup_time = req.body.pickup_time;
   const ref = req.body.ref;
   const id = req.user.id;
   const orderNumber      = `${Math.floor(100000 + Math.random() * 900000)}`;
   let output;
   let user;
   const getamount = await  calculatePrice(req, res, next);
   const amount = getamount;

   
   try{
     user = await User.findById(id);
   }catch(err){
       console.log(err);
   }
   if(!req.body.ref){

      message = "All fields are required";

      return res.status(400).json({message});
  }
if(!user){
   return  res.status(400).json({message: "No User Found"});  
}
   await axios.get(`https://api.paystack.co/transaction/verify/${ref}`,    {
      headers: {
      authorization: "Bearer sk_test_0255f1f40367a9712aba18e65864b3440d10d879",
   //replace TEST SECRET KEY with your actual test secret 
   //key from paystack
      "content-type": "application/json",
      "cache-control": "no-cache",
   },
  }).then((success)=>{
   output=success;
   }).catch((error)=>{
   output=error;
   });
   //now we check for internet connectivity issues
   if(!output.response && output.status!==200) {

  return  res.status(400).json({message: "Internet Error"});    
   }
   
   //next,we confirm that there was no error in verification.
   
   if(output.response && !output.response.data.status){
   
      return  res.status(400).json({message: "Error Verifying Payment"})
   }
     let ts = Date.now();

     let date_ob = new Date(ts);
     let date = date_ob.getDate();
     let month = date_ob.getMonth() + 1;
     let year = date_ob.getFullYear();
     const booking_time = year + "-" + month + "-" + date;

      const laundryRequest = new Booking({
       user, 
       booking_item: bookingdata,
       booking_time : booking_time,
       total_amount: amount,
       order_number: orderNumber,
       pickup_time: pickup_time
   });

   try{
       const session = await mongoose.startSession();

       session.startTransaction();
       await laundryRequest.save({session });
       user.bookings.push(laundryRequest);
       await user.save({session});

       await session.commitTransaction();

   } catch (err) {
   
       return console.log(err);
   }
  
  
   const receiver = user.email;
   sendOrderSummary(receiver, bookingdata, amount, orderNumber, booking_time);

   return res.status(200).json({message: "Order completed"})
 }
//user booking history
 export const userBookinghistory = async (req, res, next)=> {
          const id = req.user.id;
          let history;
          try{
            history= await Booking.find({user: id});
          }catch(err){
             console.log(err);
          }

         return res.status(200).json({history});
 }

 //get all supported location
 export const getAllsupportedlocation = async (req, res, next)=>{
   let allLocation;
   try{
     allLocation = await Location.find({}).where("status").equals("active");
   }catch(err){
     console.log(err);
   }
   if(!allLocation){
     return res.status(400).json({message:"No location set yet"})
   }

   return res.status(200).json(allLocation);
 }