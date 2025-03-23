"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const fileStorage_1 = require("../utils/fileStorage");
class AuthService {
    static async register(email, password) {
        const existingUser = await fileStorage_1.FileStorage.findUserByEmail(email);
        if (existingUser)
            throw new Error("User already exists");
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const userData = {
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        const userId = await fileStorage_1.FileStorage.saveUser(userData);
        return { message: "User registered successfully", userId };
    }
    static async login(email, password) {
        const user = await fileStorage_1.FileStorage.findUserByEmail(email);
        if (!user)
            throw new Error("Invalid credentials");
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword)
            throw new Error("Invalid credentials");
        const payload = {
            userId: user.id,
            email: user.email
        };
        const options = {
            expiresIn: `${config_1.default.tokenExpiration}d`
        };
        const token = jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, options);
        return { token };
    }
}
exports.AuthService = AuthService;
