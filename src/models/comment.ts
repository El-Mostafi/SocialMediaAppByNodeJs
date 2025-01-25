import mongoose from "mongoose";
export interface commentDocument extends mongoose.Document {
    userName?: string;
    content: string
}
export interface createCommentDto{
    userName: string;
    content: string;

}
export interface commentModel extends mongoose.Model<commentDocument> {
    build(createCommentDto: createCommentDto): commentDocument
}
const commentSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: false
    },
    content:{
        type: String,
        required: true
    }
});
commentSchema.statics.build= (createCommentDto: createCommentDto) => {
    return new Comment(createCommentDto);
}
const Comment = mongoose.model<commentDocument, commentModel>("Comment", commentSchema);
export default Comment;