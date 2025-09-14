import mongoose from 'mongoose';
import User from '../models/userModal.js';
import Post from '../models/postModal.js';

// 📌 Get All Posts (with pagination + category filter)
export const getAllPosts = async (req, res) => {
  const category = req.query.category || 'All';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  console.log("Category received:", category);

  try {
    let filter = {};
    if (category !== 'All' && category.toLowerCase() !== 'general') {
      filter.category = { $regex: new RegExp(category, 'i') }; // case-insensitive search
    }

    const [posts, totalPosts] = await Promise.all([
      Post.find(filter)
        .populate('user_id', 'fullName profile_pic') // fetch user details
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalPosts,
      result: posts,
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// 📌 Get Posts by a User
export const getPostByUser = async (req, res) => {
  const { user_id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }

  try {
    const posts = await Post.find({ user_id })
      .populate('user_id', 'fullName profile_pic')
      .sort({ createdAt: -1 });

    const total_posts = await Post.countDocuments({ user_id });

    res.status(200).json({
      success: true,
      result: posts.map(p => ({
        ...p._doc,
        total_posts,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 Get User Info
export const getUser = async (req, res) => {
  const { user_id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(user_id).select('fullName about profile_pic');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ userData: user });
  } catch (err) {
    console.error('Error finding user:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 Check Authentication
export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};
