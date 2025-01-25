import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import { BadRequestError } from "../../../common";

const router = Router();

router.post('/api/post/:id/delete/images', async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {imagesIds} = req.body;
    if(!id){
        return next(new BadRequestError('Id is required'));
    }
    if (!imagesIds || !Array.isArray(imagesIds) || imagesIds.length === 0) {
        return next(new BadRequestError('Image IDs are required and should be an array.'));
    }
    const updatedPost= await Post.findOneAndUpdate(
            {_id: id},
            {$pull: {images: { _id: { $in: imagesIds } } } },
            {new: true}
        );
        
    if(!updatedPost) return next(new BadRequestError('Images cannot be deleted'));
    res.status(201).json({message: 'Images deleted successfully',imagesIds: updatedPost.images.map((image) => image._id), post: updatedPost});
});

export {router as deleteImagesRouter}