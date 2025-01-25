import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import Comment from "../../models/comment";
import { BadRequestError } from "../../../common";

const router = Router();

router.delete('/api/comment/:commentId/delete/:postId', async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;

    // Check if postId and commentId are provided
    if (!postId || !commentId) return next(new BadRequestError('Post ID and Comment ID are required'));
    try {
        // Delete the comment
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) return next(new BadRequestError('Comment not found'));

        // Remove the comment reference from the post
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { comments: commentId } },
            { new: true }
        ).populate('comments', 'userName content');

        // If the post was not found
        if (!updatedPost) return next(new Error());

        // Send the updated post as the response
        res.status(200).send({ success: "Comment deleted successfully", updatedPost });

    } catch (err) {
        // Handle any unexpected errors
        next(err);
    }
});

export { router as deleteCommentRouter };
