"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationService = exports.Authentication = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
class Authentication {
    async pwdToHash(password) {
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64));
        return `${buf.toString('hex')}.${salt}`;
    }
    async pwdCompare(storedPassword, suppliedPassword) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(suppliedPassword, salt, 64));
        return buf.toString('hex') === hashedPassword;
    }
}
exports.Authentication = Authentication;
exports.authenticationService = new Authentication();
