import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {cloudinary} from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "image_url", // clearer folder name than 'image_url'
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

export const uploadPost = (req, res, next) => {
  console.log("🟢 Incoming Request:", req.method, req.url);
  console.log("🟢 Headers:", req.headers);
  console.log("🟢 Body:", req.body);
  console.log("🟢 Files:", req.files);

  upload.single("image_url")(req, res, function (err) {
    if (err) {
      console.error("🔴 Multer Error:", err);
      return res.status(400).json({ success: false, error: "File upload failed" });
    }

    console.log("✅ Uploaded File:", req.file);
    next();
  });
};
