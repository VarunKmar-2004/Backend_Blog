const pool=require('../config/db');
const newPost=async(req,res)=>{
    console.log(req.body)
    const {user_id,title,content,description,category,created_at}=req.body;
    
    const image_url = req.file ? req.file.path : null;
    const userId = parseInt(user_id);
    console.log(created_at)
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing user_id" });
    }

    // ✅ Validate all required fields
    if (!title || !content || !image_url || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        data: { user_id, title, content, image_url, description, category,created_at }
      });
    }
    try{
        const querry='INSERT INTO posts(user_id,title,content,image_url,description,category,created_at)VALUES(?,?,?,?,?,?,?) ;'
        const [result]=await pool.query(querry,[userId,title,content,image_url,description,category,created_at]);
        res.status(201).json({success:true,message:"Posted Successfull",postId:result.id});
    }catch(err){
        console.error("Error in Posting:", err);
        res.status(500).json({success:false, error: err.message });
    }
}
module.exports=newPost;