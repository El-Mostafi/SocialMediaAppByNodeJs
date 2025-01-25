import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import Comment from "../../models/comment";
import { BadRequestError , ValidationRequest } from "../../../common";
import {body} from 'express-validator';

const router = Router();


router.post('/api/comment/:commentId/update/:postId',
    [
        body('content')
        .not().isEmpty()
        .withMessage('content is required')
    ],ValidationRequest, async (req: Request, res: Response, next: NextFunction) => {
    const {postId, commentId} = req.params;
    const { userName, content } = req.body;
    if(!postId || !commentId){
        return next(new BadRequestError('post Id and comment Id are required'));
    }
        const updatedComment= await Comment.findByIdAndUpdate(
            {_id: commentId},
            { $set: {userName: userName ? userName : "anonymous", content} },
            { new: true }
        );
        if(!updatedComment) {
            return next(new BadRequestError('Comment not found'));
        }        
    
    await Post.findOneAndUpdate(
        {_id:postId},
        {$pull:{comments: commentId}}
    )
    const updatedPost = await Post.findOneAndUpdate(
        {_id:postId},
        {$push:{comments: commentId}},
        { new: true }
    ).populate('comments','userName content');
    if(updatedPost){
        res.status(201).send(updatedPost);
        return;
    }
    else{
        return next(new BadRequestError('Post not found'));
    }
});

export { router as updateCommentRouter };