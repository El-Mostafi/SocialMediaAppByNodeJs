"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOutRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.signOutRouter = router;
router.post('/signout', (req, res, next) => {
    req.session = null;
    res.status(201).send({ message: 'User signed out successfully' });
});
