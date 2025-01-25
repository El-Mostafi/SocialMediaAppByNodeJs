"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../models/user"));
const common_1 = require("../../../common");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
exports.signUpRouter = router;
router.post('/signup', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8 and 20 characters'),
], common_1.ValidationRequest, async (req, res, next) => {
    if (req.session?.jwt != null) {
        return next(new common_1.BadRequestError('Already signed in'));
    }
    const { email, password } = req.body;
    const user = await user_1.default.findOne({ email });
    if (user)
        return next(new common_1.BadRequestError('User already exists'));
    const newUser = await user_1.default.build({
        email,
        password
    });
    await newUser.save();
    req.session = {
        jwt: jsonwebtoken_1.default.sign({ email, userId: newUser._id }, process.env.JWT_KEY, { expiresIn: '10h' })
    };
    res.status(201).send({ message: 'User created successfully', user: newUser });
});
