"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHomeProducts = exports.getSingleUser = exports.getAllUsers = exports.deleteProduct = exports.updateProduct = exports.getsingleProduct = exports.getAllProducts = exports.CreateProduct = exports.adminLogin = exports.CreateAdmin = exports.CreateSuperadmin = void 0;
const utils_1 = require("../utils/utils");
const AdminModel_1 = __importDefault(require("../models/AdminModel"));
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
// import Agent from '../model/agentModel'
const CreateSuperadmin = async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;
        const validateInput = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const salt = await (0, utils_1.GenerateSalt)();
        const superAdminHashedPassword = await (0, utils_1.GeneratePassword)(password, salt);
        const superAdmin = await AdminModel_1.default.findOne({ email });
        if (!superAdmin) {
            let allAdmin = await AdminModel_1.default.create({
                name,
                email,
                password: superAdminHashedPassword,
                confirm_password: superAdminHashedPassword,
                salt,
                role: "Super Admin"
            });
            const superAdminExist = await AdminModel_1.default.findOne({ email });
            return res.status(201).json({
                message: 'Admin registered successfully',
                superAdminExist
            });
        }
        return res.status(400).json({
            message: "Admin already Exists",
            Error: "Admin already Exists"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server error",
            Error: "/admin/create-superadmin"
        });
    }
};
exports.CreateSuperadmin = CreateSuperadmin;
const CreateAdmin = async (req, res) => {
    try {
        const _id = req.admin;
        console.log(_id);
        const { name, email, password, confirm_password } = req.body;
        const validateInput = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const salt = await (0, utils_1.GenerateSalt)();
        const superAdminHashedPassword = await (0, utils_1.GeneratePassword)(password, salt);
        const admin = await AdminModel_1.default.findOne({ _id });
        if (admin?.email === email) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
        if (admin?.role === 'Super Admin') {
            let allUser = await AdminModel_1.default.create({
                name,
                email,
                password: superAdminHashedPassword,
                confirm_password: superAdminHashedPassword,
                salt,
                role: "admin",
            });
            const superAdminExist = await AdminModel_1.default.findOne({ email });
            // console.log(superAdminExist)
            return res.status(201).json({
                message: 'Admin created successfully',
                email: allUser?.email,
                name: allUser?.name
            });
        }
        return res.status(400).json({
            message: "Admin already Exists",
            Error: "Admin already Exists"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            Error: "/admin/create-admin"
        });
    }
};
exports.CreateAdmin = CreateAdmin;
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateInput = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const admin = await AdminModel_1.default.findOne({ email });
        if (!admin) {
            return res.status(400).json({
                message: "User does not exist",
                Error: "User does not exist"
            });
        }
        if (admin) {
            const validate = await bcryptjs_1.default.compare(password, admin.password);
            if (validate) {
                const token = await (0, utils_1.generateToken)(`${admin._id}`);
                res.cookie(`token`, token);
                return res.status(200).json({
                    message: "Login Successful",
                    role: admin.role,
                    email: admin.email,
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
exports.adminLogin = adminLogin;
const CreateProduct = async (req, res) => {
    try {
        const adminId = req.admin.id;
        const { name, image, description, price, countInStock } = req.body;
        const validateInput = utils_1.createProductSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const admin = await AdminModel_1.default.findOne({ adminId });
        if (admin?.role === "admin" || admin?.role === "Super Admin") {
            const createProduct = await ProductModel_1.default.create({
                name,
                description,
                price,
                countInStock,
                image: req.file.path,
                numReviews: 0,
                comment: "",
                rating: 0
            });
            return res.status(201).json({
                message: "Product created successfully",
                createProduct
            });
        }
        return res.status(400).json({
            message: "unauthorised access"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            Error: "/admin/create-agent"
        });
    }
};
exports.CreateProduct = CreateProduct;
const getAllProducts = async (req, res) => {
    try {
        // const _id = req.params._id
        // const Admin = await User.findOne({_id})
        // if(Admin?.role === "admin" || Admin?.role === "Super Admin"){
        const products = await ProductModel_1.default.find({});
        return res.status(200).json({
            message: "All Products",
            products
        });
        // }
        // return res.status(400).json({
        //     message: "unauthorised access"
        // })
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/admin/get-all-products"
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
            Error: `/admin/getProduct`
        });
    }
};
exports.getsingleProduct = getsingleProduct;
const updateProduct = async (req, res) => {
    try {
        const id = req.params._id;
        const { name, image, description, price, countInStock } = req.body;
        const validateResult = utils_1.updateProductSchema.validate(req.body, utils_1.option);
        console.log(validateResult);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const product = await ProductModel_1.default.findOne({ _id: id });
        if (!product) {
            return res.status(400).json({
                Error: "Product does not exist"
            });
        }
        const updatedProduct = await ProductModel_1.default.findOneAndUpdate({ id }, { name, description, price, countInStock, image: req.file.path }); //{new:true})
        console.log(updatedProduct);
        if (updatedProduct) {
            const productNew = await ProductModel_1.default.findOne({ _id: id });
            return res.status(200).json({
                message: "Profile updated successfully",
                productNew
            });
        }
        return res.status(400).json({
            message: "Profile not updated"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/admin/update-product`
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = req.params._id;
        const product = await ProductModel_1.default.findByIdAndDelete({ _id: id });
        const products = await ProductModel_1.default.find({});
        if (product) {
            return res.status(200).json({
                message: `Product deleted`,
                products
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: '/admin/delete-product'
        });
    }
};
exports.deleteProduct = deleteProduct;
const getAllUsers = async (req, res) => {
    try {
        // const _id = req.params._id
        // const Admin = await User.findOne({_id})
        // if(Admin?.role === "admin" || Admin?.role === "Super Admin"){
        const users = await UserModel_1.default.find({});
        return res.status(200).json({
            message: "All Users",
            users
        });
        // }
        // return res.status(400).json({
        //     message: "unauthorised access"
        // })
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/admin/get-all-users"
        });
    }
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    try {
        const id = req.params._id;
        const user = await UserModel_1.default.findOne({ _id: id });
        if (user) {
            return res.status(200).json({
                message: "The User",
                user
            });
        }
        return res.status(400).json({
            message: "User not found"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/admin/get-user`
        });
    }
};
exports.getSingleUser = getSingleUser;
const getAllHomeProducts = async (req, res) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: "i",
                },
            }
            : {};
        const count = await ProductModel_1.default.countDocuments({ ...keyword });
        const products = await ProductModel_1.default.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ _id: -1 });
        return res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/admin/get-products-p`
        });
    }
};
exports.getAllHomeProducts = getAllHomeProducts;
