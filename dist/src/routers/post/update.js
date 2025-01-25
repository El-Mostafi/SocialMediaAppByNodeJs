"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostRouter = void 0;
const express_1 = require("express");
const post_1 = __importDefault(require("../../models/post"));
const common_1 = require("../../../common");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
exports.updatePostRouter = router;
router.post('/api/post/update/:id', [
    (0, express_validator_1.body)('title')
        .not().isEmpty()
        .withMessage('title is required'),
    (0, express_validator_1.body)('content')
        .not().isEmpty()
        .withMessage('content is required')
], common_1.ValidationRequest, async (req, res, next) => {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!id) {
        return next(new common_1.BadRequestError('post Id is required'));
    }
    if (!title || !content) {
        return next(new common_1.BadRequestError('Title and content are required'));
    }
    const postUpdated = await post_1.default.findByIdAndUpdate({ _id: id }, { $set: { title, content } }, { new: true });
    if (!postUpdated)
        return next(new common_1.NotFundError());
    res.status(201).send(postUpdated);
});
