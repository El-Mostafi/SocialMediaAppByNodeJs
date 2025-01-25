"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const common_1 = require("../../../common");
const requireAuth = async (req, res, next) => {
    console.log(req.currentUser);
    if (!req.currentUser) {
        return next(new common_1.NotAutherizedError());
    }
    next();
};
exports.requireAuth = requireAuth;
