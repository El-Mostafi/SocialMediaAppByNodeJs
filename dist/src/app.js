"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const common_1 = require("../common");
const routers_1 = require("./routers");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: '*',
    optionsSuccessStatus: 200
}));
app.set('trust proxy', true);
app.use((0, body_parser_1.urlencoded)({ extended: false })); //must be true for frontend
app.use((0, body_parser_1.json)());
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: false, //must be true in production mode
}));
app.use(common_1.currentUser);
app.use(routers_1.signInRouter);
app.use(routers_1.signUpRouter);
app.use(routers_1.signOutRouter);
app.use(routers_1.currentUserRouter);
app.use(common_1.requireAuth, routers_1.addImagesRouter);
app.use(common_1.requireAuth, routers_1.deleteImagesRouter);
app.use(common_1.requireAuth, routers_1.newPostRouter);
app.use(common_1.requireAuth, routers_1.deletePostRouter);
app.use(routers_1.showPostRouter);
app.use(common_1.requireAuth, routers_1.updatePostRouter);
app.use(common_1.requireAuth, routers_1.newCommentRouter);
app.use(common_1.requireAuth, routers_1.deleteCommentRouter);
app.use(routers_1.showPostCommentsRouter);
app.use(common_1.requireAuth, routers_1.updateCommentRouter);
app.all('*', (req, res, next) => {
    next(new common_1.NotFundError());
});
app.use(common_1.errorHandler);
