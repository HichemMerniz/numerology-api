/**
 * Main application entry point
 * Sets up Express server with middleware and route configurations
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import config from "./config/config";
import numerologyRoutes from "./routes/numerologyRoutes";
import pdfRoutes from "./routes/pdfRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: { error: "Too many requests, please try again later." }
    })
);

// CORS Configuration
app.use(cors({
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
    maxAge: 86400 // 24 hours
}));

// Logging Middleware
if (config.nodeEnv === "development") {
    app.use(morgan("dev"));
}

// Body Parser Middleware
app.use(express.json({ limit: "10kb" })); // Body limit is 10kb

// API Version Prefix
const API_PREFIX = "/api/v1";

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/numerology`, numerologyRoutes);
app.use(`${API_PREFIX}/pdf`, pdfRoutes);

// Health check endpoint
app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "success",
        message: "Numerology API is running",
        version: "1.0.0",
        environment: config.nodeEnv
    });
});

// Error Types
interface AppError extends Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
}

// Global Error Handler
app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (config.nodeEnv === "development") {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production error response
        if (err.isOperational) {
            // Operational, trusted error: send message to client
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            // Programming or other unknown error: don't leak error details
            console.error("ERROR 💥", err);
            res.status(500).json({
                status: "error",
                message: "Something went wrong!"
            });
        }
    }
});

// Handle undefined routes
app.all("*", (req: Request, res: Response) => {
    res.status(404).json({
        status: "error",
        message: `Cannot find ${req.originalUrl} on this server!`
    });
});

const server = app.listen(config.port, () => {
    console.log(`
    🚀 Server running in ${config.nodeEnv} mode on port ${config.port}
    👉 Health check: http://localhost:${config.port}
    👉 API endpoint: http://localhost:${config.port}${API_PREFIX}
    `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});