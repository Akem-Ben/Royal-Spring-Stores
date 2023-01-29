"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleOrder = exports.deleteAllOrders = exports.userGetsSingleOrder = exports.userGetAllOrders = exports.userCreatesOrder = exports.updateUser = exports.userProfile = exports.getsingleProduct = exports.getAllProducts = exports.Login = exports.Register = void 0;
const utils_1 = require("../utils/utils");
const UserModel_1 = __importDefault(require("../models/UserModel"));
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const OrderModel_1 = __importDefault(require("../models/OrderModel"));
//=====REGISTER======//
const Register = async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;
        const validateInput = utils_1.registerSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const salt = await (0, utils_1.GenerateSalt)();
        const hashedPassword = await (0, utils_1.GeneratePassword)(password, salt);
        const user = await UserModel_1.default.findOne({ email });
        if (!user) {
            let allUser = await UserModel_1.default.create({
                name,
                email,
                password: hashedPassword,
                confirm_password: hashedPassword,
                salt,
                role: "user",
            });
            const userExist = await UserModel_1.default.findOne({ email });
            return res.status(201).json({
                message: 'User registered successfully',
                userExist
            });
        }
        return res.status(400).json({
            message: "User already Exists",
            Error: "User already Exists"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/singup"
        });
    }
};
exports.Register = Register;
//=============LOGIN==============//
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateInput = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const user = await UserModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist",
                Error: "User does not exist"
            });
        }
        if (user) {
            const validate = await bcryptjs_1.default.compare(password, user.password);
            if (validate) {
                const token = await (0, utils_1.generateToken)(`${user._id}`);
                res.cookie(`token`, token);
                return res.status(200).json({
                    message: "Login Successful",
                    role: user.role,
                    email: user.email,
                    token
                });
            }
        }
        return res.status(400).json({
            message: "Invalid Credentials"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/login"
        });
    }
};
exports.Login = Login;
const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel_1.default.find({});
        return res.status(200).json({
            message: "All Products",
            products
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/get-all-products"
        });
    }
};
exports.getAllProducts = getAllProducts;
const getsingleProduct = async (req, res) => {
    try {
        const id = req.params._id;
        const product = await ProductModel_1.default.findOne({ _id: id });
        if (product) {
            return res.status(200).json({
                message: "Your Product",
                product
            });
        }
        return res.status(400).json({
            message: "product not found"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/users/get-single-product`
        });
    }
};
exports.getsingleProduct = getsingleProduct;
const userProfile = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await UserModel_1.default.findOne({ _id: id });
        if (user) {
            return res.status(200).json({
                message: `Here's your profile`,
                _id: user._id,
                name: user.name,
                email: user.email
            });
        }
        return res.status(404).json({
            message: `user not found`
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/users/user-profile`
        });
    }
};
exports.userProfile = userProfile;
const updateUser = async (req, res) => {
    try {
        const id = req.user;
        const user = await UserModel_1.default.findOne({ _id: id });
        const validateResult = utils_1.updateUserSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        if (!user) {
            return res.status(404).json({
                Error: `Unauthorised user`
            });
        }
        if (user) {
            const { name, email, password } = req.body;
            const updatedUser = await UserModel_1.default.findOneAndUpdate({ id }, { name, email, password });
            if (updatedUser) {
                const use = await UserModel_1.default.findOne({ id });
                return res.status(200).json({
                    message: 'User Profile updated',
                    use
                });
            }
            return res.status(400).json({
                message: "Error occurred",
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/users/update-user`
        });
    }
};
exports.updateUser = updateUser;
// export const reviewProduct = async (req:Request, res:Response)=>{
//     try{
//             const { rating, comment } = req.body;
//             const id = req.params.id
//             const product = await Product.findById({id});
//             if (product) {
//               const alreadyReviewed = product.reviews.find(
//                 (r) => r.user.toString() === req.user._id.toString()
//               );
//               if (alreadyReviewed) {
//                 res.status(400);
//                 throw new Error("Product already Reviewed");
//               }
//               const review = {
//                 name: req.user.name,
//                 rating: Number(rating),
//                 comment,
//                 user: req.user._id,
//               };
//               product.reviews.push(review);
//               product.numReviews = product.reviews.length;
//               product.rating =
//                 product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//                 product.reviews.length;
//               await product.save();
//               res.status(201).json({ message: "Reviewed Added" });
//             } else {
//               res.status(404);
//               throw new Error("Product not Found");
//             }
//           }catch(err){
//         return res.status(500).json({
//             message: `Internal Server Error`,
//             Error: `/users/review-product`
//         })
//     }
// }
const userCreatesOrder = async (req, res) => {
    try {
        const id = req.user._id;
        const { productName, qty, image, price, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, city, country, totalPrice } = req.body;
        const validateResult = utils_1.orderProductSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //verify if user exist
        const user = await UserModel_1.default.findOne({ id });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }
        const order = await OrderModel_1.default.create({
            userId: id,
            postalCode: "",
            productName,
            qty,
            price,
            shippingAddress,
            city,
            country,
            image,
            paymentMethod,
            itemsPrice,
            paymentStatus: "",
            taxPrice,
            totalPrice,
            isPaid: false,
            paidAt: new Date(),
            shippingPrice,
            isDelivered: false,
            deliveredAt: new Date()
        });
        // const orderExist = await Order.findOne({userId})
        return res.status(201).json({
            message: "Order created successfully",
            order
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/users/create-order`
        });
    }
};
exports.userCreatesOrder = userCreatesOrder;
const userGetAllOrders = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await UserModel_1.default.find({ _id: id });
        if (!user) {
            return res.status(404).json({
                Error: `User not found`
            });
        }
        const orders = await OrderModel_1.default.find({ userId: id });
        return res.status(200).json({
            message: `Successfully fetched your others`,
            orders
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `users/get-all-orders`
        });
    }
};
exports.userGetAllOrders = userGetAllOrders;
const userGetsSingleOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user._id;
        const user = await UserModel_1.default.find({ _id: userId });
        if (!user) {
            return res.status(404).json({
                Error: `User not found`
            });
        }
        const order = await OrderModel_1.default.findOne({ orderId });
        if (!order) {
            res.status(404).json({
                Error: `Order not found`
            });
        }
        if (order?.userId === userId) {
            if (order?._id == orderId) {
                return res.status(200).json({
                    message: `Here is your order`,
                    order
                });
            }
        }
        return res.status(404).json({
            Error: `Order not found`
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `users/get-single-orders`
        });
    }
};
exports.userGetsSingleOrder = userGetsSingleOrder;
const deleteAllOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await UserModel_1.default.find({ _id: userId });
        if (!user) {
            return res.status(404).json({
                Error: `User not found`
            });
        }
        const orders = await OrderModel_1.default.deleteMany({ userId: userId });
        if (orders) {
            return res.status(200).json({
                message: `Orders successfully deleted`,
                message2: `No orders`,
                orders
            });
        }
        return res.status(400).json({
            Error: `Unable to delete`
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `users/get-single-orders`
        });
    }
};
exports.deleteAllOrders = deleteAllOrders;
const deleteSingleOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const orderId = req.params.id;
        const user = await UserModel_1.default.find({ userId });
        if (!user) {
            return res.status(404).json({
                Error: `User not found`
            });
        }
        const deletedOrder = await OrderModel_1.default.findByIdAndDelete({ _id: orderId });
        console.log(deletedOrder);
        if (deletedOrder) {
            const orders = await OrderModel_1.default.find({ userId });
            return res.status(200).json({
                message: `Order successfully deleted`,
                orders
            });
        }
        return res.status(404).json({
            Error: `Unable to delete`
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `users/get-single-orders`
        });
    }
};
exports.deleteSingleOrder = deleteSingleOrder;
