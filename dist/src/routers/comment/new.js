"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newCommentRouter = void 0;
const express_1 = require("express");
const post_1 = __importDefault(require("../../models/post"));
const comment_1 = __importDefault(require("../../models/comment"));
const common_1 = require("../../../common");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
exports.newCommentRouter = router;
router.post('/api/comment/new/:postId', [
    (0, express_validator_1.body)('content')
        .not().isEmpty()
        .withMessage('content is required')
], common_1.ValidationRequest, async (req, res, next) => {
    const { userName, content } = req.body;
    const { postId } = req.params;
    // Ensure postId is provided
    if (!postId)
        return next(new common_1.BadRequestError('Post ID is required'));
    // Create a new comment
    const newComment = comment_1.default.build({
        userName: userName ? userName : "anonymous",
        content
    });
    // Save the new comment
    try {
        await newComment.save();
    }
    catch (err) {
        const error = new common_1.BadRequestError('Error saving comment');
        return next(error);
    }
    const updatedPost = await post_1.default.findOneAndUpdate({ _id: postId }, { $push: { comments: newComment._id } }, // Use the comment ID here
    { new: true }).populate('comments', 'userName content');
    if (updatedPost) {
        res.status(201).send(updatedPost);
        return;
    }
    else {
        return next(new common_1.BadRequestError('Post not found'));
    }
});
