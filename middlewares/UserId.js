import jwt from "jsonwebtoken";
import User from "../models/userModal.js"; // MongoDB User model

export const UserId = async (req, res, next) => {
  console.log("Received Cookies:", req.cookies); // ✅ Debugging

  const { token } = req.cookies;
  if (!token) {
    console.log("⛔ No token found in cookies.");
    return res.status(401).json({ success: false, msg: "Not Authorized. Login again." });
  }

  try {
    const jwt_secret = process.env.JWT_SECRET;
    const decodedToken = jwt.verify(token, jwt_secret);

    console.log("✅ Decoded Token:", decodedToken); // ✅ Debugging

    if (!decodedToken.userId) {
      console.log("⛔ Invalid token structure.");
      return res.status(401).json({ success: false, msg: "Not authorized, login again" });
    }

    // ✅ Optional: check if user exists in MongoDB
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ success: false, msg: "User not found, login again" });
    }

    // attach userId to request body
    req.body.user_id = decodedToken.userId;
    next();
  } catch (err) {
    console.log("⛔ Token verification failed:", err.message);
    return res.status(401).json({ success: false, msg: "Not authorized, login again" });
  }
};
