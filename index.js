import express  from "express";
import dotenv  from "dotenv";
import mongoose from "mongoose";

import router from "./routes/user-routes.js";
import pricingRouter  from "./routes/pricing-routes.js";
import bookingRouter from "./routes/booking-routes.js";
import cookieParser from 'cookie-parser';
import adminRoute from "./routes/admin-routes.js";
import cors from 'cors';
const app = express();


// var corsOptions = {
//     origin: 'http://localhost:8080',
//     optionsSuccessStatus: 200 // For legacy browser support
// }

// app.use(cors(corsOptions));

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/user", router);
app.use("/api/pricing", pricingRouter);

app.use("/api/booking", bookingRouter);

app.use("/api/admin", adminRoute);
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI).then(()=> app.listen(5000)).then(()=> console.log("connected")
).catch((err)=> console.log(err));


