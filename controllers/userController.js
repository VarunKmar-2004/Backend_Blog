const pool = require("../config/db");
require("dotenv").config();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const cookie=require('cookie-parser')
const User=require('../models/userModal.js')
const registerUser = async (req, res) => {
  try {
    const { name, email, password, about } = req.body;
    const profile_picture = req.file ? req.file.path : null; // ✅ Get uploaded image URL
    const existingUser=await User.getUserByEmail(email);
    if(existingUser) return res.status(400).json({success:false,msg:"user already exists"})
    const jwt_secret=process.env.JWT_SECRET;
    const hashedPassword=await bcrypt.hash(password,10);
    const query = "INSERT INTO users (name, email, password, profile_picture, about) VALUES (?, ?, ?, ?, ?)";
    const [result] = await pool.query(query, [name, email,hashedPassword, profile_picture, about]); // ✅ Use await
    const token = jwt.sign({ id:result.insertId  },jwt_secret, { expiresIn: "3d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });
        res.status(201).json({ message: "User registered successfully", userId: result.insertId });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ error: error.message });
  }
};
const userLogin=async (req,res)=>{
  try{
     const {email,password}=req.body;
     console.log(email,password);
     if (!email || !password) {
      return res.status(400).json({ success: false, msg: "All fields should be filled" });
    }
    const querry="SELECT id,email,password FROM users WHERE email=?";
    const [result]=await pool.query(querry,[email]);
    if(result.length===0){
      return res.status(400).json({success:false,msg:"invaild email"});
    }
    const user=result[0];
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({success:false,msg:"incorrect password"});
    }
    const jwt_secret=process.env.JWT_SECRET;
    const token = jwt.sign({ userId: user.id, email: user.email },jwt_secret, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,     
      secure: true,        // ❌ Remove 'true' in local development (ONLY for localhost)
      sameSite: "none",      // Less strict for development
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
    res.status(200).json({
      success:true,
      token
  })
  }catch(err){
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
}
const userLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({ success: true, msg: "Logged out successfully" });
};
module.exports = { registerUser,userLogin,userLogout };
