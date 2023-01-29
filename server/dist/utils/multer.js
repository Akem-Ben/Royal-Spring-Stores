"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const database_1 = require("../config/database");
dotenv_1.default.config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: database_1.cloudinary_name,
    api_key: database_1.cloudinary_key,
    api_secret: database_1.cloudinary_secret
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary,
    params: async (res, file) => {
        return {
            folder: `ROYALSPRINGSTORES`
        };
    }
});
exports.upload = (0, multer_1.default)({ storage: storage });
