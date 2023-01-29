"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import {APP_SECRET} from "../../../config/db"
const UserModel_1 = __importDefault(require("../models/UserModel"));
const AdminModel_1 = __importDefault(require("../models/AdminModel"));
const database_1 = require("../config/database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                Error: 'Kindly login'
            });
        }
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, database_1.app_secret);
        if (!verified) {
            return res.status(401).json({
                Error: "Unauthorised"
            });
        }
        const { _id } = verified;
        const user = await UserModel_1.default.findOne({ _id: _id });
        if (!user) {
            return res.status(401).json({
                Error: 'Invalid Credentials'
            });
        }
        req.user = verified;
        next();
    }
    catch (err) {
        return res.status(401).json({
            Error: "Unauthorised Access"
        });
    }
};
exports.userAuth = userAuth;
const adminAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                Error: 'Kindly login'
            });
        }
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, database_1.app_secret);
        if (!verified) {
            return res.status(401).json({
                Error: "Unauthorised"
            });
        }
        const { _id } = verified;
        const admin = await AdminModel_1.default.findOne({ _id: _id });
        if (!admin) {
            return res.status(401).json({
                Error: 'Invalid Credentials'
            });
        }
        req.admin = verified;
        next();
    }
    catch (err) {
        return res.status(401).json({
            Error: "Unauthorised Access"
        });
    }
};
exports.adminAuth = adminAuth;
