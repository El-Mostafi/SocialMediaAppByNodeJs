import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";

declare global {
    var signin: () => Promise<string[]>
}

let mongo :any;
beforeAll(async () => {
    process.env.JWT_KEY = "zmp9qwerbvcsfgkcgkc";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    mongo = await MongoMemoryServer.create();
    let mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db!.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = async () => {
    const response = await request(app).post('/signin').send({
        email: 'test@gmail.com', // Corrected email format
        password: 'mohamed11'
    }).expect(201);
    console.log(response.body); // Log response for debugging
    const cookie = response.get('Set-Cookie');
    return cookie as string[];
};
