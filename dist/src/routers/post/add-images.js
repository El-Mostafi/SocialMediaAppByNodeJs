"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addImagesRouter = void 0;
const express_1 = require("express");
const post_1 = __importDefault(require("../../models/post"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const common_1 = require("../../../common");
const router = (0, express_1.Router)();
exports.addImagesRouter = router;
router.post('/api/post/:id/add/images', common_1.uploadImage, async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new common_1.BadRequestError('Id is required'));
    }
    if (!req.files)
        return next(new common_1.BadRequestError('Images are required'));
    let images;
    if (typeof req.files === "object") {
        images = Object.values(req.files);
    }
    else {
        images = req.files ? [...req.files] : [];
    }
    const imagesArray = images.map((file) => {
        const filePath = path_1.default.join('upload', file.filename);
        const fileBuffer = fs_1.default.readFileSync(filePath);
        const srcObj = {
            src: `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`
        };
        fs_1.default.unlink(filePath, (err) => {
            if (err)
                return next(new common_1.BadRequestError('Failed to delete file'));
        });
        return srcObj;
    });
    const updatedPost = await post_1.default.findOneAndUpdate({ _id: id }, { $push: { images: { $each: imagesArray } } }, { new: true }).populate('comments', 'userName content');
    if (!updatedPost)
        return next(new common_1.BadRequestError('Post cannot be updated'));
    res.status(201).json({ message: 'Post updated successfully', imagesIds: updatedPost.images.map((image) => image._id), post: updatedPost });
});
