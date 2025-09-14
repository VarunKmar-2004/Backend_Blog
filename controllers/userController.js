import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModal.js';  // ✅ corrected import (with .js)

// 📌 Register User
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, about } = req.body;
    const profile_pic = req.file ? req.file.path : null;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profile_pic,
      about,
    });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ only secure in prod
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ success: true, message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Login User
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "Invalid email" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Incorrect password" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ only in prod
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Error in userLogin:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// 📌 Logout User
export const userLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  return res.status(200).json({ success: true, msg: "Logged out successfully" });
};
