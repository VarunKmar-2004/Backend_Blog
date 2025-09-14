import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {cloudinary} from "../config/cloudinary.js";

// ✅ Storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_picture", // Folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

// ✅ Middleware
const uploadMiddleware = (req, res, next) => {
  console.log("🟢 Incoming Request:", req.method, req.url);
  console.log("🟢 Headers:", req.headers);
  console.log("🟢 Body:", req.body);
  console.log("🟢 Files:", req.files);

  upload.single("profile_picture")(req, res, function (err) {
    if (err) {
      console.error("🔴 Multer Error:", err);
      return res.status(400).json({ error: "File upload failed" });
    }

    console.log("✅ Uploaded File:", req.file); // Cloudinary file info
    next();
  });
};

// ✅ Default export
export default uploadMiddleware;
