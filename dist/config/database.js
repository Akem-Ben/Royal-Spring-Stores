"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary_secret = exports.cloudinary_key = exports.cloudinary_name = exports.app_secret = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDatabase = async () => {
    try {
        const connection = await mongoose_1.default.connect(`mongodb://localhost:27017/royal_spring_stores`, () => {
            console.log(`MongoDB connected`);
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.connectDatabase = connectDatabase;
exports.app_secret = process.env.APP_SECRET;
exports.cloudinary_name = process.env.CLOUDINARY_CLOUD_NAME;
exports.cloudinary_key = process.env.CLOUDINARY_API_KEY;
exports.cloudinary_secret = process.env.CLOUDINARY_API_SECRET;
