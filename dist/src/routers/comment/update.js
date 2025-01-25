"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentRouter = void 0;
const express_1 = require("express");
const post_1 = __importDefault(require("../../models/post"));
const comment_1 = __importDefault(require("../../models/comment"));
const common_1 = require("../../../common");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
exports.updateCommentRouter = router;
router.post('/api/comment/:commentId/update/:postId', [
    (0, express_validator_1.body)('content')
        .not().isEmpty()
        .withMessage('content is required')
], common_1.ValidationRequest, async (req, res, next) => {
    const { postId, commentId } = req.params;
    const { userName, content } = req.body;
    if (!postId || !commentId) {
        return next(new common_1.BadRequestError('post Id and comment Id are required'));
    }
    const updatedComment = await comment_1.default.findByIdAndUpdate({ _id: commentId }, { $set: { userName: userName ? userName : "anonymous", content } }, { new: true });
    if (!updatedComment) {
        return next(new common_1.BadRequestError('Comment not found'));
    }
    await post_1.default.findOneAndUpdate({ _id: postId }, { $pull: { comments: commentId } });
    const updatedPost = await post_1.default.findOneAndUpdate({ _id: postId }, { $push: { comments: commentId } }, { new: true }).populate('comments', 'userName content');
    if (updatedPost) {
        res.status(201).send(updatedPost);
        return;
    }
    else {
        return next(new common_1.BadRequestError('Post not found'));
    }
});
