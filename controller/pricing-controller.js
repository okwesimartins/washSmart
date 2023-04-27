import Pricing from "../model/Pricing.js";


// export const createPricing = async (req, res, next)=>{
//        const {wash_and_fold_one_time, wash_and_fold_smart_wash,dry_cleaning,ironing}=
//        req.body;
//         let pricing;
//         let checkpricing;
      


//        if(wash_and_fold_one_time && wash_and_fold_smart_wash && dry_cleaning,ironing){
//              if(dry_cleaning.top && dry_cleaning.bottom && dry_cleaning.full_body && dry_cleaning.house_hold){
//                      pricing = new Pricing({
//                         wash_and_fold_one_time,
//                         wash_and_fold_smart_wash,
//                         dry_cleaning:{
//                             top: dry_cleaning.top,
//                             bottom: dry_cleaning.bottom,
//                             full_body: dry_cleaning.full_body,
//                             house_hold: dry_cleaning.house_hold
//                         },
//                         ironing
//                     });

//                     try{
//                         pricing.save();
//                     }catch(err){
//                         console.log(err);
//                     }
//                     return res.status(200).json({message:"Pricing created", pricing:pricing});
//              }else{
//                return res.status(400).json({message:"All drycleaning fields are required"});
//              }
//        }else{
//         return res.status(400).json({message:"All fields are required"});
//        }
// }
export const updatePricing = async (req, res, next) => {
    const {id,wash_and_fold_smart_wash_yearly_plan_per_bag,wash_and_fold_one_time, wash_and_fold_smart_wash,wash_iron_and_fold_smart_wash,wash_iron_and_fold_one_time, wash_iron_and_fold_smart_wash_yearly_plan_per_bag,dry_cleaning,ironing}=
    req.body;
    if(id && wash_and_fold_smart_wash_yearly_plan_per_bag &&wash_and_fold_one_time  && wash_iron_and_fold_smart_wash && wash_iron_and_fold_one_time && wash_iron_and_fold_smart_wash_yearly_plan_per_bag && wash_and_fold_smart_wash && dry_cleaning,ironing){
        if(id && dry_cleaning.top && dry_cleaning.bottom && dry_cleaning.full_body && dry_cleaning.house_hold && dry_cleaning.native_wear && ironing.top && ironing.bottom && ironing.full_body && ironing.native_wear){
           
            let pricing;
            let updatedpricing;
            try{
              pricing = await Pricing.findById(id);

            }catch(err){
                console.log(err);
            }

            if(!pricing){
                return res.status(400).json({message:"No pricing with this id"});
            }
            try{
                updatedpricing =  await Pricing.findByIdAndUpdate(id,{
                    wash_and_fold_one_time,
                    wash_and_fold_smart_wash,
                    dry_cleaning:{
                        top: dry_cleaning.top,
                        bottom: dry_cleaning.bottom,
                        full_body: dry_cleaning.full_body,
                        house_hold: dry_cleaning.house_hold,
                        native_wear : dry_cleaning.native_wear,
                    },
                    ironing:{
                        top: ironing.top,
                        bottom: ironing.bottom,
                        full_body: ironing.full_body,
                        native_wear : ironing.native_wear,
                    },
                    wash_iron_and_fold_one_time,
                    wash_and_fold_smart_wash_yearly_plan_per_bag,
                    wash_iron_and_fold_smart_wash,
                    wash_iron_and_fold_smart_wash_yearly_plan_per_bag
                 });
            }catch(err){
                console.log(err);
            }
             if(!updatedpricing){
                return res.status(400).json({message:"Unable to update"});
             }
          return res.status(200).json({updatedpricing});
        }else{
            return res.status(400).json({message:"All drycleaning and ironing fields are required"});
          }
    }else{
        return res.status(400).json({message:"All fields are required"});
       }

}

export const getpricingList =  async (req, res, next)=>{
            let pricingData;
           
            try{
                pricingData = await Pricing.findOne({});
            }catch(err){
               console.log(err);
            }

            return res.status(200).json(pricingData);
}

export const getsinglePricinglist = async (req, res, next) =>{
         const id = req.params.id;
         let pricing;

         try{
            pricing = await Pricing.findById(id);
         }catch(err){
            console.log(err);
         }

         return res.status(200).json({pricing});
}
