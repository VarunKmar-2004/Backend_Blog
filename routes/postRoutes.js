const express = require("express");
const UserId = require("../middlewares/UserId");
const newPost = require("../controllers/PostController");
const uploadPost=require('../middlewares/uploadPost')
const router=express.Router();
router.post('/newposts',uploadPost,newPost);
module.exports=router;