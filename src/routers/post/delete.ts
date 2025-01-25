import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import User from "../../models/user";
import { BadRequestError } from "../../../common";

const router = Router();


router.delete('/api/post/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    if(!id){
        return next(new BadRequestError('Id is required'));
    }
    const deletePost= await Post.findOneAndDelete(
            {_id: id}
        );
    if(deletePost){
        const updatedUser = await User.findOneAndUpdate(
            {_id: req.currentUser!.userId},
            {$pull: {posts: deletePost._id}},
            {new: true}
        );
        if(!updatedUser) return next(new BadRequestError('User not found'));
        res.status(201).json({success: "post successfully deleted",updatedUser});
    }
    else{
        const error = new BadRequestError('Post cannot be deleted');
        return next(error);
    }
});

export { router as deletePostRouter };