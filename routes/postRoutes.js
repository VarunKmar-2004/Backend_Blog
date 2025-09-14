import express from 'express';
import {newPost} from '../controllers/PostController.js'
import {uploadPost} from '../middlewares/uploadPost.js'
const router=express.Router();
router.post('/newposts',uploadPost,newPost);
export default router;