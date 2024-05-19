import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRoutes.js';
import communityRouter from './routes/communityRoutes.js';
import CORS from 'cors';
dotenv.config();
mongoose.connect(process.env.MONGO_URI,{
    dbName:'krets'
}).then(()=>{
    console.log('connected to mongo');
})
.catch((err)=>{
    console.log(err)
});

const app = express();
app.use(CORS());
app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/post',postRouter);
app.use('/api/community',communityRouter);
app.use((err,req,res,next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
});
app.listen(3431,()=>{
    console.log('server running on port 3431');
});