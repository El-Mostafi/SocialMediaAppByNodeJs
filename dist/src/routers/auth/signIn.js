"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInRouter = void 0;
const express_1 = require("express");
const user_1 = __importDefault(require("../../models/user"));
const common_1 = require("../../../common");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
exports.signInRouter = router;
router.post('/signin', [
    (0, express_validator_1.body)('email')
        .not().isEmpty()
        .isEmail()
        .withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password')
        .not().isEmpty()
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8 and 20 characters')
], common_1.ValidationRequest, async (req, res, next) => {
    const { email, password } = req.body;
    if (req.session?.jwt != null) {
        return next(new common_1.BadRequestError('Already signed in'));
    }
    const user = await user_1.default.findOne({ email });
    if (!user)
        return next(new common_1.BadRequestError('Wrong email or password'));
    const isEqual = await common_1.authenticationService.pwdCompare(user.password, password);
    if (isEqual) {
        const token = jsonwebtoken_1.default.sign({ email, userId: user._id }, process.env.JWT_KEY, { expiresIn: '10h' });
        req.session = { jwt: token };
        res.status(201).send({ message: 'User signed in successfully', user: user });
    }
    else {
        return next(new common_1.BadRequestError('Wrong email or password'));
    }
});
