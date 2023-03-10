"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    userId: { type: String },
    productName: { type: String, required: [true, `Please input your name`] },
    qty: { type: String, required: [true, `Please choose a quantity`] },
    price: { type: String },
    shippingPrice: { type: Number, required: true },
    // product: {type:[String], default: []},
    shippingAddress: { type: String, required: true },
    city: { type: String, required: true },
    itemsPrice: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true },
    image: { type: String },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String },
    taxPrice: { type: String },
    totalPrice: { type: String },
    isPaid: { type: String },
    paidAt: { type: String },
    isDelivered: { type: String },
    deliveredAt: { type: String }
}, {
    timestamps: true
});
const Order = mongoose_1.default.model('order', orderSchema);
exports.default = Order;
