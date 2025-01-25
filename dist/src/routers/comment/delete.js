"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentRouter = void 0;
const express_1 = require("express");
const post_1 = __importDefault(require("../../models/post"));
const comment_1 = __importDefault(require("../../models/comment"));
const common_1 = require("../../../common");
const router = (0, express_1.Router)();
exports.deleteCommentRouter = router;
router.delete('/api/comment/:commentId/delete/:postId', async (req, res, next) => {
    const { postId, commentId } = req.params;
    // Check if postId and commentId are provided
    if (!postId || !commentId)
        return next(new common_1.BadRequestError('Post ID and Comment ID are required'));
    try {
        // Delete the comment
        const deletedComment = await comment_1.default.findByIdAndDelete(commentId);
        if (!deletedComment)
            return next(new common_1.BadRequestError('Comment not found'));
        // Remove the comment reference from the post
        const updatedPost = await post_1.default.findByIdAndUpdate(postId, { $pull: { comments: commentId } }, { new: true }).populate('comments', 'userName content');
        // If the post was not found
        if (!updatedPost)
            return next(new Error());
        // Send the updated post as the response
        res.status(200).send({ success: "Comment deleted successfully", updatedPost });
    }
    catch (err) {
        // Handle any unexpected errors
        next(err);
    }
});
