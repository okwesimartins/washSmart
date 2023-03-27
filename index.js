import express  from "express";
import dotenv  from "dotenv";
import mongoose from "mongoose";

import router from "./routes/user-routes.js";
import pricingRouter  from "./routes/pricing-routes.js";
import bookingRouter from "./routes/booking-routes.js";
import cookieParser from 'cookie-parser';
const app = express();


dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", router);
app.use("/api/pricing", pricingRouter);

app.use("/api/booking", bookingRouter);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI).then(()=> app.listen(5000)).then(()=> console.log("connected")
).catch((err)=> console.log(err));