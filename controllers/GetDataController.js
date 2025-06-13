const express=require('express');
const pool=require('../config/db');
const getAllPosts = async (req, res) => {
    const category = req.query.category || 'All';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; // default 6 posts per page
    const offset = (page - 1) * limit;
     // 👈 default to 'All' if not passed
    console.log("Category received:", category);
  
    try {
      let query;
      let countQuery;
      let values = [];
  
      if (category === 'All' || category.toLowerCase() === 'general') {
        query = `
          SELECT users.id AS user_id, users.name, users.profile_picture, posts.id AS post_id, 
               posts.title, posts.content,posts.description, posts.image_url, posts.created_at 
        FROM users 
        INNER JOIN posts ON users.id = posts.user_id
        ORDER BY posts.created_at DESC
        LIMIT ? OFFSET ?
        `;
        values = [limit, offset];
        countQuery = `SELECT COUNT(*) AS count FROM posts`;
      } else {
        query = `
          SELECT users.id AS user_id, users.name, users.profile_picture, posts.id AS post_id, 
               posts.title, posts.content,posts.description ,posts.image_url, posts.created_at 
        FROM users 
        INNER JOIN posts ON users.id = posts.user_id
        WHERE LOWER(posts.category) = LOWER(?)
        ORDER BY posts.created_at DESC
        LIMIT ? OFFSET ?
      `;
      values = [category, limit, offset];

      countQuery = `SELECT COUNT(*) AS count FROM posts WHERE LOWER(category) = LOWER(?)`;
      }
  
      const [result] = await pool.query(query, values);
    const [countResult] = await pool.query(countQuery, category === 'All' || category.toLowerCase() === 'general' ? [] : [category]);

    const totalPosts = countResult[0].count;
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalPosts,
      result,
    });

  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
  };
const getPostById=async(req,res)=>{
  const postId=req.params.id
  if(isNaN(postId)){
     return res.status(400).json({success:false, message: 'Invalid post ID' });
  }
  try {
    const [result] = await pool.query(`
  SELECT posts.*, users.name, users.email, users.profile_picture 
  FROM posts 
  JOIN users ON posts.user_id = users.id 
  WHERE posts.id = ?
`, [postId]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    console.log(result[0])
    res.status(200).json({success:true,result});
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
const getPostByUser=async(req,res)=>{
    const {user_id}=req.body;
    try{
        const query=`SELECT 
    users.id AS user_id,
    users.name,
    users.profile_picture,
    posts.id AS post_id,
    posts.title,
    posts.description,
    posts.content,
    posts.image_url,
    posts.created_at,
    (
        SELECT COUNT(*) 
        FROM posts 
        WHERE posts.user_id = users.id
    ) AS total_posts
FROM users
INNER JOIN posts ON users.id = posts.user_id
WHERE users.id = ?
ORDER BY posts.created_at DESC;`;
const [result]=await pool.query(query,[user_id]);
res.status(200).json({success:true,result:result});
    }catch(err){
        res.status(500).json({success:false,message:err.message})
    }
}

const getUser=async (req,res)=>{
    const {user_id}=req.body;
    try{
        const query=`SELECT * FROM users WHERE id=?`;
        const [result]=await pool.query(query,[user_id]);
        res.status(200).json({
            userData:{
            id:result[0].id,
            name:result[0].name,
            about:result[0].about,
            profile_picture:result[0].profile_picture,
            }
        })
    }catch(err){
        console.log('error finding user:',err);
        res.status(500).json({message:err.message});
    }
}
const isAuthenticated=async(req,res)=>{
    try{
        return res.status(200).json({success:true});
    }catch(err){
        return res.status(401).json({message:err.message});
    }
}
module.exports={getAllPosts,getPostByUser,getUser,isAuthenticated,getPostById};