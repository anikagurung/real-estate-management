import { sendOtp, signOut, signin, signup, verifyOtp } from "../controllers/auth.controller.js";
import express from 'express';

const router = express.Router();
router.post("/signup",signup) 
router.post("/signin",signin); 
router.get('/signout', signOut);
router.post("/send-otp", sendOtp);  // Route to send OTP
router.post("/verify-otp", verifyOtp);



export default router;