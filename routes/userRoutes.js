import express from 'express'
import multer from 'multer'
const upload=multer()
import { registerUser, userLogin, userLogout } from  "../controllers/userController.js";

import uploadMiddleware from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", uploadMiddleware, registerUser);
router.post('/login',upload.none(),userLogin);
router.post('/logout',userLogout);
export default router