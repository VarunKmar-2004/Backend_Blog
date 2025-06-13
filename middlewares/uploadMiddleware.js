const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_picture",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

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

    console.log("✅ Uploaded File:", req.file); // Check if file is available
    next();
  });
};

module.exports = uploadMiddleware;
