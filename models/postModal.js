import mongoose from 'mongoose';
const PostSchema=new mongoose.Schema({
  user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  title:{
    type:String,
    required:true,
    trim:true,
  },
  description:{
    type:String,
    required:true,
  },
  content:{
    type:String,
    required:true,
  },
  image_url:{
    type:String,
    default:'',
  },
  category:{
    type:String,
    default:'General'
  },
  created_at:{
    type:Date,
    default:Date.now,
  }
},{timestamps:true})
const Post=mongoose.model('Post',PostSchema);
export default Post;

