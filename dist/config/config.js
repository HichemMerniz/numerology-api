"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const config = {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/numerology',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_do_not_use_in_production',
    tokenExpiration: Number(process.env.TOKEN_EXPIRATION) || 1,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    apiKey: process.env.API_KEY || 'default_api_key',
    logLevel: process.env.LOG_LEVEL || 'info',
    pdfStoragePath: process.env.PDF_STORAGE_PATH || './storage/pdfs',
    maxPdfSizeMb: Number(process.env.MAX_PDF_SIZE_MB) || 10
};
// Validate required environment variables in production
if (config.nodeEnv === 'production') {
    const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI', 'API_KEY'];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Environment variable ${envVar} is required in production`);
        }
    }
}
exports.default = config;
