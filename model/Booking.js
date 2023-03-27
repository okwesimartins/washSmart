import mongoose from "mongoose";



const Schema = mongoose.Schema;

const bookingsSchema = new Schema({
         user:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
         },   

         booking_item: {
            type: Array,
            default: [],
            required: true
         },

         booking_time: {
            type:String,
            required: true
         },
         total_amount: {
            type:String,
            required: true
         },
         order_number:{
            type:String,
            required: true
         }
});


export default mongoose.model("Booking", bookingsSchema);