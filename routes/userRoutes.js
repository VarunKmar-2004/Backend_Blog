const express = require("express");
const multer=require('multer')
const upload=multer()
const { registerUser, userLogin, userLogout } = require("../controllers/userController");

const uploadMiddleware = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/register", uploadMiddleware, registerUser);
router.post('/login',upload.none(),userLogin);
router.post('/logout',userLogout);
module.exports = router;