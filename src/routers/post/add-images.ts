import { Router, Request, Response, NextFunction } from "express";
import Post from "../../models/post";
import fs from 'fs';
import path from 'path';
import { BadRequestError,uploadImage } from "../../../common";

const router = Router();

router.post('/api/post/:id/add/images',uploadImage, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    if(!id){
        return next(new BadRequestError('Id is required'));
    }
    if(!req.files) return next( new BadRequestError('Images are required'));

    let images : Array<Express.Multer.File>;

    if(typeof req.files === "object") {
        images = Object.values(req.files);
    }
    else{
        images = req.files ? [...req.files] : [];
    }
    const imagesArray = images.map((file:Express.Multer.File) =>{
                const filePath = path.join('upload', file.filename);
                const fileBuffer = fs.readFileSync(filePath);
                const srcObj = {
                    src: `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`
                };
                fs.unlink(filePath, (err) => {
                    if (err) return next(new BadRequestError('Failed to delete file'));
                });
                return srcObj;
            })
    const updatedPost= await Post.findOneAndUpdate(
            {_id: id},
            { $push: { images: { $each: imagesArray } } },
            {new: true}
        ).populate('comments', 'userName content');
    if(!updatedPost) return next(new BadRequestError('Post cannot be updated'));
    res.status(201).json({message: 'Post updated successfully',imagesIds: updatedPost.images.map((image) => image._id), post: updatedPost});
});

export {router as addImagesRouter}