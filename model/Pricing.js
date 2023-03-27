
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const pricingSchema = new Schema({
       wash_and_fold_one_time:{
        type: String,
        required: true
       },
       wash_and_fold_smart_wash:{
        type:String,
        required: true
       },
       dry_cleaning:{
          top:{
              type: Array,
              default: [],
              required: true
          },
          bottom:{
            type: Array,
            default: [],
            required: true
          },
          full_body:{
            type: Array,
            default: [],
            required: true
          },
          house_hold:{
            type: Array,
            default: [],
            required: true
          }
       },
       ironing:{
        type:String,
        required: true
       }

});

export default mongoose.model("Pricing", pricingSchema);