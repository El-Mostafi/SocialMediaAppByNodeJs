"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPostRouter = void 0;
const express_1 = require("express");
const post_1 = __importDefault(require("../../models/post"));
const user_1 = __importDefault(require("../../models/user"));
const common_1 = require("../../../common");
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
exports.newPostRouter = router;
router.post('/api/post/new', common_1.uploadImage, [
    (0, express_validator_1.body)('title')
        .not().isEmpty()
        .withMessage('title is required'),
    (0, express_validator_1.body)('content')
        .not().isEmpty()
        .withMessage('content is required')
], common_1.ValidationRequest, async (req, res, next) => {
    const { title, content } = req.body;
    if (!req.files)
        return next(new common_1.BadRequestError('Images are required'));
    let images;
    if (typeof req.files === "object") {
        images = Object.values(req.files);
    }
    else {
        images = req.files ? [...req.files] : [];
    }
    const newPost = post_1.default.build({
        title,
        content,
        images: images.map((file) => {
            const filePath = path_1.default.join('upload', file.filename);
            const fileBuffer = fs_1.default.readFileSync(filePath);
            const srcObj = {
                src: `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`
            };
            fs_1.default.unlink(filePath, (err) => {
                if (err)
                    console.error(`Failed to delete file ${filePath}:`, err);
            });
            return srcObj;
        })
    });
    if (!newPost) {
        const error = new Error('Post cannot be created');
        return next(error);
    }
    await newPost.save();
    const updatedUser = await user_1.default.findOneAndUpdate({ _id: req.currentUser.userId }, { $push: { posts: newPost._id } }, { new: true })
        .populate({
        path: 'posts',
        select: 'title content images',
        populate: {
            path: 'comments',
            select: 'userName content', // Include fields you want from comments
        }
    });
    if (updatedUser) {
        res.status(201).send(updatedUser);
        return;
    }
    else {
        return next(new common_1.BadRequestError('User not found'));
    }
});
