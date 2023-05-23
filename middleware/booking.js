


export const validateBookingData = async (req, res, next) =>{
  
    let message;

    if(!req.body.items){
        message = "All fiels are required";

        return res.status(400).json({message});
    }
    
    else{
        const items = req.body.items;
        items.every(value => {
            if(!value.service_type){
                 message = "Service type field is required";
                 
                 return false;
            }else{
                if(value.service_type == "dry_cleaning" || value.service_type == "ironing"){
                 
                    if(!value.service_name || !value.cloth_category || !value.cloth_name || !value.quantity  || !value.pricing){
                      message = "All fields in the dry cleaning service type are required";
        
                      return false;
                    }
                 }else if(value.service_type == "wash_and_fold_one_time" || value.service_type == "wash_and_fold_smart_wash" || value.service_type == "wash_iron_and_fold_one_time" || value.service_type == "wash_iron_and_fold_smart_wash" ||  value.service_type == "wash_iron_and_fold_smart_wash_yearly_plan_per_bag" || value.service_type == "wash_and_fold_smart_wash_yearly_plan_per_bag"){
                    if(!value.service_name   || !value.quantity  || !value.pricing){
                        message = "All fields  are required";
        
                        return false;
                      }
                 }
            }
           
           });

          if(message){
            return res.status(400).json({message});
          }
  

           next();
    }
   
}