"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const currentUser = (req, res, next) => {
    if (req.session?.jwt == null) {
        return next();
    }
    try {
        const payload = (jsonwebtoken_1.default.verify(req.session?.jwt, process.env.JWT_KEY));
        req.currentUser = payload;
    }
    catch (err) {
        return next(err);
    }
    next();
};
exports.currentUser = currentUser;
