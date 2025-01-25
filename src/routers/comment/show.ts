import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import Comment from "../../models/comment";
import { BadRequestError } from "../../../common";

const router = Router();


router.get('/api/post/:postId/comments/:commentId?', async (req: Request, res: Response, next: NextFunction) => {
    const {postId, commentId} = req.params;
    if(!postId){
        return next(new BadRequestError('post Id is required') );
    }
    if(!commentId && postId){
            const postWithComments = await Post.findOne({ _id: postId }).populate("comments");
            if(postWithComments){
                res.status(201).send(postWithComments);
                return ;
            }
            else{
                return next(new BadRequestError('Post Comments not found'));
            }
    }
        const showComment= await Comment.findOne(
            {_id: commentId}
        );
        if(showComment){
        res.status(201).send(showComment);
        return ;
        }
        else{
            return next(new BadRequestError('Comment not found'));
        }
});

export { router as showPostCommentsRouter };