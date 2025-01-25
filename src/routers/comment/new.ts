import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import Comment from "../../models/comment";
import { BadRequestError , ValidationRequest } from "../../../common";
import {body} from 'express-validator';
const router = Router();

router.post('/api/comment/new/:postId',
    [
        body('content')
        .not().isEmpty()
        .withMessage('content is required')
    ],ValidationRequest ,async (req: Request, res: Response, next: NextFunction) => {
    const { userName, content } = req.body;
    const { postId } = req.params;

    // Ensure postId is provided
    if (!postId) return next(new BadRequestError('Post ID is required'));

    // Create a new comment
    const newComment = Comment.build({
        userName: userName ? userName : "anonymous",
        content
    });

    // Save the new comment
    try {
        await newComment.save();
    } catch (err) {
        const error = new BadRequestError('Error saving comment') ;
        return next(error);
    }

    
        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { comments: newComment._id } },  // Use the comment ID here
            { new: true }
        ).populate('comments', 'userName content');  
        if(updatedPost){
            res.status(201).send(updatedPost);
            return ;
        }
        else{
        return next(new BadRequestError('Post not found'));
        }

});

export { router as newCommentRouter };
