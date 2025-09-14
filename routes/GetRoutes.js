import express from 'express'
import {getAllPosts,getPostByUser,getUser,isAuthenticated} from '../controllers/GetDataController.js'
import {UserId} from '../middlewares/UserId.js'
const router=express.Router();
router.get("/posts",getAllPosts);
router.get("/userData",UserId,getUser);
router.get('/is-auth',UserId,isAuthenticated);
router.get('/user-posts',UserId,getPostByUser);

export default router