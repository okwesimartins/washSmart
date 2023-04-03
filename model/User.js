import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema ({
       name: {
        type: String,
        required: true
       },
       email: {
        type: String,
        required: true,
        unique: true
       },
       phone_number: {
        type: String,
        unique: true
       },
       password:{
        type: String,
        minlength: 6
       },
       role:{
              type: String,
              required: true
          },
       location:{
              type: String,
              required: false
       },
       bookings:[{
        type : mongoose.Types.ObjectId,
        ref: "Bookings",
        required: true
       }]

});

export default mongoose.model("User", userSchema);