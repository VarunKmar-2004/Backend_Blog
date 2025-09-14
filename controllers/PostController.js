import Post from "../models/postModal.js";

export const newPost = async (req, res) => {
  try {
    console.log(req.body);

    const { user_id, title, content, description, category, created_at } = req.body;
    const image_url = req.file ? req.file.path : null;

    // ✅ Validate required fields
    if (!user_id || !title || !content || !image_url || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        data: { user_id, title, content, image_url, description, category, created_at },
      });
    }

    // ✅ Create new post document
    const newPost = new Post({
      user_id,
      title,
      content,
      image_url,
      description,
      category,
      created_at: created_at || new Date(),
    });

    // ✅ Save to MongoDB
    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      message: "Posted Successfully",
      post: savedPost,
    });
  } catch (err) {
    console.error("Error in Posting:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
