const express=require("express");
const {getAllPosts,getUser, isAuthenticated, getPostByUser, getPostById}  = require("../controllers/GetDataController");
const UserId = require("../middlewares/UserId");
const router=express.Router();
router.get("/posts",getAllPosts);
router.get('/posts/:id',getPostById);
router.get("/userData",UserId,getUser);
router.get('/is-auth',UserId,isAuthenticated);
router.get('/user-posts',UserId,getPostByUser);

module.exports=router;