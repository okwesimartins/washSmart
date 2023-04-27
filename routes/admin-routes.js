import express from "express";

import {getAllUsers,suspendActivateLocation,updateAdminPassword, getAllLocation, adminLogin, inputWashsmartLocation, updateAdminPhonenumber} from "../controller/admin-controller.js";
import { verifyToken, IsAdmin} from "../middleware/auth.js";


const adminRoute = express.Router();


adminRoute.post("/login",adminLogin);
adminRoute.put("/update-admin-phonenumber",verifyToken,IsAdmin,updateAdminPhonenumber);
adminRoute.post("/add-location",inputWashsmartLocation);
adminRoute.get("/get-all-users",verifyToken,IsAdmin,getAllUsers);
adminRoute.get("/get-all-washsmart-locations",verifyToken,IsAdmin,getAllLocation);

adminRoute.get("/change-location-status/:id",verifyToken,IsAdmin,suspendActivateLocation);
adminRoute.put("/update-admin-password",verifyToken,IsAdmin,updateAdminPassword);

export default adminRoute;
