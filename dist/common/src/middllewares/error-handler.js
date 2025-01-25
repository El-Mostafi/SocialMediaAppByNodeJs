"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custome_error_1 = require("../errors/custome-error");
const errorHandler = (err, req, res, next) => {
    if (err instanceof custome_error_1.CustomError) {
        res.status(err.statusCode).json({ errors: err.generateErrors() });
        return;
    }
    res.status(500).json({ message: "Something went wrong", error: err });
};
exports.errorHandler = errorHandler;
