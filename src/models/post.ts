import mongoose from "mongoose";
import { commentDocument } from "./comment";

export interface PostDocument extends mongoose.Document {
    title: string,
    content: string,    
    images: Array<{_id: mongoose.Types.ObjectId,src: string}>,    
    comments?: Array<commentDocument>,
}
export interface createPostDto{
    title: string,
    content: string,
    images: Array<{src: string}>,    
}
export interface PostModel extends mongoose.Model<PostDocument>{
    build(createPostDto: createPostDto): PostDocument
}
const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }, 
    images:[
        {
            src :{
                type: String,
                required: true
            }
        }
    ],
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

postSchema.statics.build =(createPostDto: createPostDto) => {
    return new Post(createPostDto);
}
const Post = mongoose.model<PostDocument, PostModel>("Post", postSchema);
export default Post;