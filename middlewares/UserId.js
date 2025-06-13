const jwt = require("jsonwebtoken");

const UserId = async (req, res, next) => {
    console.log("Received Cookies:", req.cookies); // ✅ Debugging

    const {token}  = req.cookies;
    if (!token) {
        console.log("⛔ No token found in cookies.");
        return res.status(401).json({ success: false, msg: "Not Authorized Login Again" });
    }

    try {
        const jwt_secret = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, jwt_secret);

        console.log("✅ Decoded Token:", decodedToken); // ✅ Debugging

        if (decodedToken.userId) {
            req.body.user_id = decodedToken.userId;
            next();
        } else {
            console.log("⛔ Invalid token structure.");
            return res.status(401).json({ success: false, msg: "Not authorized, login again" });
        }
    } catch (err) {
        console.log("⛔ Token verification failed:", err.message);
        return res.status(401).json({ success: false, msg: "Not authorized, login again" });
    }
};

module.exports = UserId;
