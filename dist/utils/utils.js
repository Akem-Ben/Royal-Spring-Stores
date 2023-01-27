"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.GeneratePassword = exports.GenerateSalt = exports.option = exports.updateProductSchema = exports.orderProductSchema = exports.createProductSchema = exports.updatePropertySchema = exports.adminSchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.registerSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirm_password: joi_1.default.any()
        .equal(joi_1.default.ref('password')).required()
        .label('Confirm Password')
        .messages({ "any.only": "{{label}} does not match" }) //ref('password'),
});
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
});
exports.updateUserSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    email: joi_1.default.string(),
    password: joi_1.default.string()
});
exports.adminSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirm_password: joi_1.default.any()
        .equal(joi_1.default.ref('password')).required()
        .label('Confirm Password')
        .messages({ "any.only": "{{label}} does not match" })
});
exports.updatePropertySchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    address: joi_1.default.string(),
    category: joi_1.default.string(),
    price: joi_1.default.number(),
    propertySize: joi_1.default.string(),
    condition: joi_1.default.string(),
    image: joi_1.default.string()
});
exports.createProductSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    image: joi_1.default.string(),
    description: joi_1.default.string(),
    price: joi_1.default.number(),
    countInStock: joi_1.default.number()
});
exports.orderProductSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    qty: joi_1.default.number(),
    image: joi_1.default.string(),
    price: joi_1.default.number(),
    shippingAddress: joi_1.default.string(),
    paymentMethod: joi_1.default.string(),
    itemsPrice: joi_1.default.number(),
    taxPrice: joi_1.default.number(),
    shippingPrice: joi_1.default.number(),
    totalPrice: joi_1.default.number(),
    city: joi_1.default.string(),
    country: joi_1.default.string()
});
exports.updateProductSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    image: joi_1.default.string(),
    description: joi_1.default.string(),
    price: joi_1.default.number(),
    countInStock: joi_1.default.number()
});
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        }
    }
};
const GenerateSalt = async () => {
    return await bcryptjs_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await bcryptjs_1.default.hash(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const generateToken = async (_id) => {
    if (process.env.APP_SECRET) {
        return jsonwebtoken_1.default.sign({ _id }, process.env.APP_SECRET, { expiresIn: '1d' });
    }
};
exports.generateToken = generateToken;
