"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRequest = void 0;
const request_validator_error_1 = require("../errors/request-validator-error");
const express_validator_1 = require("express-validator");
const ValidationRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new request_validator_error_1.RequestValidationError(errors.array()));
    }
    next();
};
exports.ValidationRequest = ValidationRequest;
