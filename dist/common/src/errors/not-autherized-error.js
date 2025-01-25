"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAutherizedError = void 0;
const custome_error_1 = require("./custome-error");
class NotAutherizedError extends custome_error_1.CustomError {
    constructor() {
        super('Not Authorized');
        this.statusCode = 401;
    }
    generateErrors() {
        return [{ message: 'Not Authorized' }];
    }
}
exports.NotAutherizedError = NotAutherizedError;
