"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../app");
const supertest_1 = __importDefault(require("supertest"));
let mongo;
beforeAll(async () => {
    process.env.JWT_KEY = "zmp9qwerbvcsfgkcgkc";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    let mongoUri = await mongo.getUri();
    await mongoose_1.default.connect(mongoUri);
});
beforeEach(async () => {
    const collections = await mongoose_1.default.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});
afterAll(async () => {
    await mongo.stop();
    await mongoose_1.default.connection.close();
});
global.signin = async () => {
    const response = await (0, supertest_1.default)(app_1.app).post('/signin').send({
        email: 'test@gmail.com', // Corrected email format
        password: 'mohamed11'
    }).expect(201);
    console.log(response.body); // Log response for debugging
    const cookie = response.get('Set-Cookie');
    return cookie;
};
