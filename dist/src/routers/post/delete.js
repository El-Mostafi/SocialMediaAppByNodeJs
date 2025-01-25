"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostRouter = void 0;
const express_1 = require("express");
const post_1 = __importDefault(require("../../models/post"));
const user_1 = __importDefault(require("../../models/user"));
const common_1 = require("../../../common");
const router = (0, express_1.Router)();
exports.deletePostRouter = router;
router.delete('/api/post/delete/:id', async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new common_1.BadRequestError('Id is required'));
    }
    const deletePost = await post_1.default.findOneAndDelete({ _id: id });
    if (deletePost) {
        const updatedUser = await user_1.default.findOneAndUpdate({ _id: req.currentUser.userId }, { $pull: { posts: deletePost._id } }, { new: true });
        if (!updatedUser)
            return next(new common_1.BadRequestError('User not found'));
        res.status(201).json({ success: "post successfully deleted", updatedUser });
    }
    else {
        const error = new common_1.BadRequestError('Post cannot be deleted');
        return next(error);
    }
});
