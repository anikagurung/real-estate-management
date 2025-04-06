import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import sellerRouter from './routes/seller.route.js';
import propertyRoutes from './routes/property.route.js';
import adminRoute from './routes/admin.route.js';
import bookingRoutes from './routes/booking.route.js';
import reviewRoutes from './routes/review.route.js';

import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();


mongoose.connect(process.env.MONGO_URI).then(() =>{
    console.log('Connected to MongoDB!');
    }).catch((err) =>{
    console.log(err);
    })
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
  };
  app.use(cors(corsOptions));
  

app.use(express.json());
app.use(cookieParser());


app.listen(3000, () =>{
    console.log('Server is running on port 3000!');
});

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
app.use('/api/user',userRouter);
app.use('/api/auth', authRouter);
app.use('/api/seller', sellerRouter); 
app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoute);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);



app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });

});