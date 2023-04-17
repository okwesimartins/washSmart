import express  from "express";
import { generateGoogleurl, signup,login, updatePassword, updateUser,addGoogleuser, userDashboardApi, updatePhonenumber, updatForgotPassword, getLocation, updateDeliveryAddress} from "../controller/user-controller.js";
import { generateOtp, validateOtp } from "../controller/otp-controller.js";
import { verifyToken, IsUser } from "../middleware/auth.js";
const router = express.Router();


router.get("/", generateGoogleurl)

router.get("/sendotp/:email", generateOtp)
router.post("/verify-otp", validateOtp)
router.post("/signup", signup)
router.get("/google/auth", addGoogleuser)
router.get("/dashboardapi", verifyToken,IsUser,userDashboardApi)

router.post("/location", getLocation)

router.post("/update-location", verifyToken,IsUser,updateDeliveryAddress)

router.post("/login", login)
router.post("/forgot-password", updatForgotPassword)
router.post("/update-password", verifyToken,IsUser,updatePassword)
router.post("/update-user", verifyToken,IsUser,updateUser)

router.post("/update-phonenumber", verifyToken,IsUser,updatePhonenumber)

export default router;
