import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  //checking if all data is available
  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "All details not provided",
    });
  }

  try {
    //checking if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User Already Exists",
      });
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    //creating token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //send welcome mail to user
    // const mailOptions = {
    //   from: process.env.SENDER_EMAIL,
    //   to: email,
    //   subject: "Welcome to Our Organization",
    //   text: `Welcome to our organization. Your account has been successfully created with email ${email}`,
    // };

    // console.log(process.env.SENDER_EMAIL);
    // console.log(email);

    //await transporter.sendMail(mailOptions);

    //send response
    return res.json({
      success: true,
      message: "Account Created Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Error creating account: ${error.message}`,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "email and password are required",
    });
  }

  try {
    //check if user exixts
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "invalid email",
      });
    }

    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "invalid password",
      });
    }

    //creating token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //generating and storing token
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Logged in Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//function to send otp and verify email
export const sendVerifyOtp = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    //check if user email is already verified
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Email is already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
    user.verifyOtp = otp;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify email using OTP",
      //text: `Your OTP is ${otp}. Please enter this OTP in input field on website to verify your email.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", `${user.email}`).replace(
        "{{otp}}",
        `${otp}`
      ),
    };

    await transporter.sendMail(mailOptions);

    await user.save();

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP already expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//send password reset otp
export const sendResetPasswordOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      //text: `Your password reset OTP is ${otp}. Use this OTP to reset your password.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{email}}", `${email}`).replace(
        "{{otp}}",
        `${otp}`
      ),
    };

    await user.save();

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Password reset OTP sent on mail",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "All fields are necessary" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found, please enter correct email",
      });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Incorrect OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP already expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset succcessfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
