"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});
userSchema.pre('save', async function (done) {
    if (this.isModified('password') || this.isNew) {
        const HashedPassword = await common_1.authenticationService.pwdToHash(this.get('password'));
        this.set('password', HashedPassword);
    }
    done();
});
userSchema.statics.build = (createUserDto) => {
    return new User(createUserDto);
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
