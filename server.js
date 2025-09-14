import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser'; 
import cors from 'cors';
import { connectDB } from './config/db.js';

const app = express();

// ✅ Middlewares
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "https://blogverse-tau.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// ✅ Routes
import getRoutes from './routes/GetRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

app.get('/', (req, res) => {
    res.send('Hello World with MongoDB!');
});

app.use('/api/home', getRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// ✅ Connect DB and Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
