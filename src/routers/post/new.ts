import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import User from "../../models/user";
import { BadRequestError, uploadImage, ValidationRequest } from "../../../common";
import {body} from 'express-validator';
import fs from 'fs';
import path from 'path';
const router = Router();


router.post('/api/post/new',
    uploadImage,
    [
        body('title')
        .not().isEmpty()
        .withMessage('title is required'),
        body('content')
        .not().isEmpty()
        .withMessage('content is required')
    ],ValidationRequest ,
    async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;

    if(!req.files) return next( new BadRequestError('Images are required'));

    let images : Array<Express.Multer.File>;

    if(typeof req.files === "object") {
        images = Object.values(req.files);
    }
    else{
        images = req.files ? [...req.files] : [];
    }

    
    const newPost= Post.build({
        title,
        content,
        images:images.map((file:Express.Multer.File) =>{
            const filePath = path.join('upload', file.filename);
            const fileBuffer = fs.readFileSync(filePath);
            const srcObj = {
                src: `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`
            };
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Failed to delete file ${filePath}:`, err);
            });
            
            return srcObj;
        })
    });
    if(!newPost){
        const error = new Error('Post cannot be created');
        return next(error);
    }
    await newPost.save();
    const updatedUser = await User.findOneAndUpdate(
        { _id: req.currentUser!.userId },
        { $push: { posts: newPost._id } },
        { new: true }
    )
        .populate({
            path: 'posts',
            select: 'title content images',
            populate: {
                path: 'comments',
                select: 'userName content', // Include fields you want from comments
            }
        });
    if(updatedUser){
        res.status(201).send(updatedUser);
        return ;
    }
    else{
    return next(new BadRequestError('User not found'));
    }
});

export { router as newPostRouter };
