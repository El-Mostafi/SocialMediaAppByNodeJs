"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showPostRouter = void 0;
const express_1 = require("express");
const post_1 = __importDefault(require("../../models/post"));
const common_1 = require("../../../common");
const router = (0, express_1.Router)();
exports.showPostRouter = router;
router.get('/api/post/show/:id?', async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        const allPosts = await post_1.default.find().populate('comments', 'userName content');
        res.status(201).send(allPosts);
        return;
    }
    const showPost = await post_1.default.findOne({ _id: id }).populate('comments', 'userName content');
    if (!showPost)
        return next(new common_1.NotFundError());
    res.status(201).send(showPost);
});
