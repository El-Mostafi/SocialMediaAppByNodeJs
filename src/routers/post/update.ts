import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import { BadRequestError,NotFundError, ValidationRequest } from "../../../common";
import {body} from 'express-validator';

const router = Router();


router.post('/api/post/update/:id',
    [
        body('title')
        .not().isEmpty()
        .withMessage('title is required'),
        body('content')
        .not().isEmpty()
        .withMessage('content is required')
    ],ValidationRequest ,
    async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const { title, content } = req.body;
    if(!id){
        return next(new BadRequestError('post Id is required'));
    }
    if (!title || !content) {
        return next(new BadRequestError('Title and content are required'));
    }
    const postUpdated= await Post.findByIdAndUpdate(
            {_id: id},
            { $set: {title, content} },
            { new: true }
        );
    if(!postUpdated) return next(new NotFundError());
    res.status(201).send(postUpdated);
});

export { router as updatePostRouter };