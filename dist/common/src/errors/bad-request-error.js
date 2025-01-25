"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const custome_error_1 = require("./custome-error");
class BadRequestError extends custome_error_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 400;
    }
    generateErrors() {
        return [{ message: this.message }];
    }
}
exports.BadRequestError = BadRequestError;
