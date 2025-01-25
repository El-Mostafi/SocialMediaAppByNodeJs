"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFundError = void 0;
const custome_error_1 = require("./custome-error");
class NotFundError extends custome_error_1.CustomError {
    constructor() {
        super('Not Fund');
        this.statusCode = 404;
    }
    generateErrors() {
        return [{ message: 'Not Fund' }];
    }
}
exports.NotFundError = NotFundError;
