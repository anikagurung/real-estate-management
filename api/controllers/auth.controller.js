import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';

export const signup = async (req, res, next) => {
  const { username, email, password, role, contact, fullname } = req.body;


  if (!username || !email || !password) {
    return next(errorHandler(400, "Username, email, and password are required."));
  }

  if (password.length < 8) {
    return next(errorHandler(400, "Password must be at least 8 characters long."));
  }


  if (role === "seller") {
    if (!fullname) {
      return next(errorHandler(400, "Full Name is required for sellers."));
    }
    if (!contact || !/^(98|97)\d{8}$/.test(contact)) {
      return next(errorHandler(400, "A valid phone number is required for sellers."));
    }
  } else if (role === "buyer") {
    if (fullname || contact) {
      return next(errorHandler(400, "Buyers should not provide full name or contact."));
    }
  }


  const newUser = new User({ username, email, password, role, contact, fullname });

  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    if (error.code === 11000) {
     
      const field = Object.keys(error.keyValue)[0];
      return next(errorHandler(400, `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`));
    }
    next(error);
  }
};


/*export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    if (password !== validUser.password) {
      return next(errorHandler(401, "Wrong Credentials!"));
    }

    const token = jwt.sign({ id: validUser._id, role: validUser.role }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      }).cookie("seller_id", validUser._id, {
        httpOnly: false, // `false` to allow client-side access via Cookies.get()
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      })
      .status(200)
      .json({ ...rest, token });
  } catch (error) {
    next(error);
  }
};*/
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
      const validUser = await User.findOne({ email });
      if (!validUser) return next(errorHandler(404, "User not found!"));

      /*if (!validUser.isEmailVerified) {
          return next(errorHandler(403, "Please verify your email to sign in."));
      }*/

      if (password !== validUser.password) {
          return next(errorHandler(401, "Wrong Credentials!"));
      }

      const token = jwt.sign({ id: validUser._id, role: validUser.role }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = validUser._doc;

      res
          .cookie("access_token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "None",
          })
          .status(200)
          .json({ ...rest, token });
  } catch (error) {
      next(error);
  }
};



export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
export const sendOtp = async (req, res, next) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) return next(errorHandler(404, "User not found!"));

      const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
      user.otp = otp;
      user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
      await user.save();

      const message = `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`;
      await sendEmail(email, "Email Verification", message);

      res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
      next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) return next(errorHandler(404, "User not found!"));

      if (!user.otp || user.otpExpiresAt < Date.now()) {
          return next(errorHandler(400, "OTP has expired. Please request a new one."));
      }

      if (user.otp !== otp) {
          return next(errorHandler(400, "Invalid OTP."));
      }

      // Mark email as verified
      user.otp = null; // Clear OTP after successful verification
      user.otpExpiresAt = null;
      user.isEmailVerified = true; // Update email verification status
      await user.save();

      res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
      next(error);
  }
};
