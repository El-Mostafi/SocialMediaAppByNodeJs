import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import { NotFundError } from "../../../common";

const router = Router();


router.get('/api/post/show/:id?', async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    if(!id){
        const allPosts = await Post.find().populate('comments', 'userName content');
        res.status(201).send(allPosts);
        return;
    }
    const showPost= await Post.findOne(
            {_id: id}
        ).populate('comments', 'userName content');
    if(!showPost) return next(new NotFundError());
    res.status(201).send(showPost);
});

export { router as showPostRouter };