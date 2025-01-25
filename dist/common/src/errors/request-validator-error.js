"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const custome_error_1 = require("./custome-error");
class RequestValidationError extends custome_error_1.CustomError {
    constructor(errors) {
        super('Invalid request');
        this.errors = errors;
        this.statusCode = 400;
    }
    generateErrors() {
        return this.errors
            .filter((error) => 'path' in error)
            .map((error) => {
            return { message: error.msg, field: error.path };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
