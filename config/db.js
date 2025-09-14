import mongoose from 'mongoose'
export const connectDB=async()=>{
  try{
    const conn=await mongoose.connect(process.env.MONGO_URI);
    console.log('Database Connected Successfully')
  }catch(error){
    console.log('something error occured:',error)
  }
}