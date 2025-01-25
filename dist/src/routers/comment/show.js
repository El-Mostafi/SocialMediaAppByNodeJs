"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showPostCommentsRouter = void 0;
const express_1 = require("express");
const post_1 = __importDefault(require("../../models/post"));
const comment_1 = __importDefault(require("../../models/comment"));
const common_1 = require("../../../common");
const router = (0, express_1.Router)();
exports.showPostCommentsRouter = router;
router.get('/api/post/:postId/comments/:commentId?', async (req, res, next) => {
    const { postId, commentId } = req.params;
    if (!postId) {
        return next(new common_1.BadRequestError('post Id is required'));
    }
    if (!commentId && postId) {
        const postWithComments = await post_1.default.findOne({ _id: postId }).populate("comments");
        if (postWithComments) {
            res.status(201).send(postWithComments);
            return;
        }
        else {
            return next(new common_1.BadRequestError('Post Comments not found'));
        }
    }
    const showComment = await comment_1.default.findOne({ _id: commentId });
    if (showComment) {
        res.status(201).send(showComment);
        return;
    }
    else {
        return next(new common_1.BadRequestError('Comment not found'));
    }
});
