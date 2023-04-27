
import mongoose from "mongoose";


const Schema = mongoose.Schema;

const adminSchema =  new Schema({
         name:{
            type: String,
            required: true
         },
         email:{
            type: String,
            required: true,
         },
         phone_number:{
            type: String,
            required: true
         },
         password: {
            type: String,
            required: true
         },
         role:{
            type: String,
            required: true
        },
        earnings: {
         type: String,
         required: true
        }
});

export default mongoose.model("Admin", adminSchema);