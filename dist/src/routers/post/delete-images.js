"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImagesRouter = void 0;
const express_1 = require("express");
const post_1 = __importDefault(require("../../models/post"));
const common_1 = require("../../../common");
const router = (0, express_1.Router)();
exports.deleteImagesRouter = router;
router.post('/api/post/:id/delete/images', async (req, res, next) => {
    const { id } = req.params;
    const { imagesIds } = req.body;
    if (!id) {
        return next(new common_1.BadRequestError('Id is required'));
    }
    if (!imagesIds || !Array.isArray(imagesIds) || imagesIds.length === 0) {
        return next(new common_1.BadRequestError('Image IDs are required and should be an array.'));
    }
    const updatedPost = await post_1.default.findOneAndUpdate({ _id: id }, { $pull: { images: { _id: { $in: imagesIds } } } }, { new: true });
    if (!updatedPost)
        return next(new common_1.BadRequestError('Images cannot be deleted'));
    res.status(201).json({ message: 'Images deleted successfully', imagesIds: updatedPost.images.map((image) => image._id), post: updatedPost });
});
