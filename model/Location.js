import mongoose from "mongoose";

const Schema = mongoose.Schema;


const locationWeServe = new Schema({
    name:{
        type: String,
        required: true
       },
    status:{
        type: String,
        required: true,
        default:"active"
    }
});

export default mongoose.model("Location", locationWeServe);