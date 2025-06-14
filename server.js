require('dotenv').config();
const express=require('express');
const cookieParser = require("cookie-parser"); 
const cors = require('cors');
const db = require('./config/db');
const app=express();
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173",'https://blogverse-tau.vercel.app/'],  // Allow only frontend on port 3000
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow sending cookies (if needed)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
const getRoutes=require('./routes/GetRoutes.js');
const userRoutes=require('./routes/userRoutes.js');
const postRoutes=require('./routes/postRoutes.js');
app.get('/',(req,res)=>{
    res.send('Hello World!');
})
app.use('/api/home',getRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users",postRoutes);
app.listen(5000,()=>{
   console.log("server running successfully");
})