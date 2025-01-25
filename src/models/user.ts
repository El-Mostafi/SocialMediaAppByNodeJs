import mongoose from "mongoose";
import { authenticationService } from "../../common";
import { PostDocument } from "./post";

export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    posts?: Array<PostDocument>;
}

export interface createUserDto {
    email: string;
    password: string; 
}

export interface UserModel extends mongoose.Model<UserDocument> {
    build(createUserDto: createUserDto): UserDocument
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});
userSchema.pre('save', async function(done){
    if(this.isModified('password') || this.isNew){ 
        const HashedPassword =await authenticationService.pwdToHash(this.get('password'));
        this.set('password', HashedPassword);
    }
    done();
});

userSchema.statics.build = (createUserDto: createUserDto) => {
    return new User(createUserDto);
}

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
export default User;