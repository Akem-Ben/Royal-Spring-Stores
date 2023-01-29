"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_1 = require("./config/database");
const User_1 = __importDefault(require("./routes/User"));
const Product_1 = __importDefault(require("./routes/Product"));
const Admin_1 = __importDefault(require("./routes/Admin"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config();
(0, database_1.connectDatabase)();
//Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(process.cwd(), './public')));
//Routes
app.use('/users', User_1.default);
app.use('/product', Product_1.default);
app.use('/admin', Admin_1.default);
app.listen(process.env.PORT, () => {
    console.log(`App paying attention on port ${process.env.PORT}`);
});
exports.default = app;
