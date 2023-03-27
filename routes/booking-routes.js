import express from "express";
import { getTotalamount, createRequest, userBookinghistory } from "../controller/bookings-controller.js";
import { verifyToken, IsUser } from "../middleware/auth.js";
import { validateBookingData } from "../middleware/booking.js";

const bookingRouter = express.Router();

bookingRouter.get("/booking-history", verifyToken, IsUser, userBookinghistory);
bookingRouter.post("/calculate-booking", verifyToken, IsUser,validateBookingData, getTotalamount);
bookingRouter.post("/laundry-request", verifyToken, IsUser,validateBookingData, createRequest);
export default bookingRouter;