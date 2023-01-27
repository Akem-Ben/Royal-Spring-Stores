"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const userHandlers_1 = require("../handlers/userHandlers");
// import { upload } from '../Utils/multer'
const router = express_1.default.Router();
// import { upload } from '../Utils/multer'
router.post('/signup', userHandlers_1.Register);
router.post('/login', userHandlers_1.Login);
router.get('/get-all-products', auth_1.userAuth, userHandlers_1.getAllProducts);
router.get('/get-single-product/:_id', auth_1.userAuth, userHandlers_1.getsingleProduct);
router.get('/user-profile', auth_1.userAuth, userHandlers_1.userProfile);
router.patch('/update-profile', auth_1.userAuth, userHandlers_1.updateUser);
router.post('/create-order', auth_1.userAuth, userHandlers_1.userCreatesOrder);
// router.get('/get-all-users', getAllUsers)
// router.get('/get-user/:_id', getUser)
// router.patch('/update-user/:_id', auth, upload.single('coverImage'), updateUser)
// router.delete('/delete-user/:_id', deleteUser)
exports.default = router;
