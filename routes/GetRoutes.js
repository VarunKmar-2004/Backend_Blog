import express from 'express'
import {getAllPosts,getPostByUser,getUser,isAuthenticated} from '../controllers/GetDataController.js'
import {UserId} from '../middlewares/UserId.js'
import Post from '../models/postModal.js';
const router=express.Router();
router.get("/posts",getAllPosts);
router.get("/userData",UserId,getUser);
router.get('/is-auth',UserId,isAuthenticated);
router.get('/user-posts',UserId,getPostByUser);
router.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("user_id", "fullName profile_pic");
    console.log("Requested ID:", id); 
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router