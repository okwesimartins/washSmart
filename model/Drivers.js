import mongoose from "mongoose";

const Schema = mongoose.Schema;

const driverSchema = new Schema({
           name:{
            type: String,
            required: true
           },
           email:{
            type: String,
            required: true
           },
           phone_number:{
            type: String,
            required: true
           },
           password:{
            type: String,
            required: false
           },
           role:{
            type: String,
            required: true
        },
        active:{
            type: Boolean,
            default: true
        }
           
});

export default mongoose.model("Driver", driverSchema);