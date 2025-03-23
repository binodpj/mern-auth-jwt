import express, { Router } from "express";
const router = Router();

import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetPasswordOtp,
  resetPassword,
} from "../controllers/auth.js";
import userAuth from "../middlewares/auth.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-email", userAuth, verifyEmail);
router.get("/is-auth", userAuth, isAuthenticated);
router.post("/send-reset-password-otp", sendResetPasswordOtp);
router.post("/reset-password", resetPassword);

export default router;
