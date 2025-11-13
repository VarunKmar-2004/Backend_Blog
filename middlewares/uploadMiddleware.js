import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";

// Storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_picture",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Multer instance with limits + file filter
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/.test(file.mimetype);
    if (allowed) cb(null, true);
    else cb(new Error("INVALID_FILE_TYPE"));
  },
});

// Middleware to run the single-file upload and handle errors
const uploadMiddleware = (req, res, next) => {
  console.log("🟢 Incoming Request:", req.method, req.url);
  console.log("🟢 Headers:", req.headers);
  console.log("🟢 Body:", req.body);

  // get the middleware function and call it
  const single = upload.single("profile_pic");
  single(req, res, (err) => {
    if (err) {
      console.error("🔴 Multer/Error:", err);

      if (err instanceof multer.MulterError) {
        // Multer-specific error (e.g. file too large)
        return res.status(400).json({ error: err.message });
      }

      // custom or other errors
      return res.status(400).json({ error: err.message || "File upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Cloudinary upload info is usually in req.file (inspect this in your environment)
    console.log("✅ Uploaded File (req.file):", req.file);
    next();
  });
};

export default uploadMiddleware;
