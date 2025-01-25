"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const custome_error_1 = require("./custome-error");
class DatabaseConnectionError extends custome_error_1.CustomError {
    constructor() {
        super('Error connecting to database');
        this.statusCode = 500;
    }
    generateErrors() {
        return [{ message: 'Error connecting to database' }];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
