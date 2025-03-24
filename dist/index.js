"use strict";
/**
 * Main application entry point
 * Sets up Express server with middleware and route configurations
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = __importDefault(require("./config/config"));
const fileStorage_1 = require("./utils/fileStorage");
const numerologyRoutes_1 = __importDefault(require("./routes/numerologyRoutes"));
const pdfRoutes_1 = __importDefault(require("./routes/pdfRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: config_1.default.corsOrigin,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    maxAge: 86400 // 24 hours
}));
// Rate limiting
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));
// Logging Middleware
if (config_1.default.nodeEnv === "development") {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.json({ limit: "10kb" }));
// Health check endpoint
app.get("/", (_req, res) => {
    res.status(200).json({
        status: "success",
        message: "Numerology API is running",
        version: "1.0.0",
        environment: config_1.default.nodeEnv
    });
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/numerology', numerologyRoutes_1.default);
app.use('/api', pdfRoutes_1.default);
// Handle undefined routes
app.all("*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: `Cannot find ${req.originalUrl} on this server!`
    });
});
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (config_1.default.nodeEnv === "development") {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    else {
        // Production error response
        if (err.isOperational) {
            // Operational, trusted error: send message to client
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        else {
            // Programming or other unknown error: don't leak error details
            console.error("ERROR 💥", err);
            res.status(500).json({
                status: "error",
                message: "Something went wrong!"
            });
        }
    }
});
// Initialize storage and start server
const initializeApp = async () => {
    try {
        await fileStorage_1.FileStorage.initializeStorage();
        console.log('✅ File storage initialized successfully');
        // Start server
        app.listen(config_1.default.port, () => {
            console.log(`✅ Server is running on port ${config_1.default.port}`);
        });
    }
    catch (error) {
        console.error('❌ Error initializing file storage:', error);
        process.exit(1);
    }
};
initializeApp();
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
