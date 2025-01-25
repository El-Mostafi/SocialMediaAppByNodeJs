import mongoose from "mongoose";
// import * as dotenv from "dotenv";
// dotenv.config();
// import express, { Request, Response, NextFunction } from "express";
// import { json, urlencoded } from "body-parser";
// import cors from "cors";
// import cookieSession from "cookie-session";
// import {requireAuth, currentUser,errorHandler,NotFundError} from "../common";
// import {
//     newPostRouter,
//     deletePostRouter,
//     showPostRouter,
//     updatePostRouter,
//     addImagesRouter,
//     deleteImagesRouter,

//     newCommentRouter,
//     deleteCommentRouter,
//     showPostCommentsRouter,
//     updateCommentRouter,

//     signInRouter,
//     signUpRouter,
//     signOutRouter,
//     currentUserRouter,
// } from './routers';

// const app = express();
// app.use(cors({
//     origin: '*',
//     optionsSuccessStatus: 200 
// }))
// app.set('trust proxy', true);
// app.use(urlencoded({ extended: false }));//must be true for frontend
// app.use(json());
// app.use(cookieSession({
//     signed: false,
//     secure: false,//must be true in production mode
// }))

// app.use(signUpRouter);
// app.use(signInRouter);

// app.use(currentUser);

// app.use(signOutRouter);
// app.use(currentUserRouter);

// app.use(requireAuth,addImagesRouter);
// app.use(requireAuth,deleteImagesRouter);

// app.use(requireAuth,newPostRouter);
// app.use(requireAuth,deletePostRouter);
// app.use(showPostRouter);
// app.use(requireAuth,updatePostRouter);

// app.use(requireAuth,newCommentRouter);
// app.use(requireAuth,deleteCommentRouter);
// app.use(showPostCommentsRouter);
// app.use(requireAuth,updateCommentRouter);

// app.all('*',(req,res,next)=>{
//     next(new NotFundError());
// })




// app.use(errorHandler);
import {app} from "./app";
const start = async () => {
    if (!process.env.MONGO_URL) throw new Error("MONGO_URL must be defined");
    if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");

        try {
            await mongoose.connect(process.env.MONGO_URL);
            console.log("Connected to MongoDB");
        } catch (err: any) {
            throw new Error(err);
        }
        app.listen(3030, () => console.log("Server is running on port 3030"));
};

start();
