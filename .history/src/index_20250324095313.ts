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
import { FileStorage } from "./utils/fileStorage";
import numerologyRoutes from "./routes/numerologyRoutes";
import pdfRoutes from "./routes/pdfRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: config.corsOrigin,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    maxAge: 86400 // 24 hours
}));

// Rate limiting
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    })
);

// Logging Middleware
if (config.nodeEnv === "development") {
    app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));

// Health check endpoint
app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "success",
        message: "Numerology API is running",
        version: "1.0.0",
        environment: config.nodeEnv
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/numerology', numerologyRoutes);
app.use('/api/pdf', pdfRoutes);

// Handle undefined routes
app.all("*", (req: Request, res: Response) => {
    res.status(404).json({
        status: "error",
        message: `Cannot find ${req.originalUrl} on this server!`
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

// Initialize storage and start server
const initializeApp = async () => {
    try {
        await FileStorage.initializeStorage();
        console.log('✅ File storage initialized successfully');

        // Start server
        app.listen(config.port, () => {
            console.log(`✅ Server is running on port ${config.port}`);
        });
    } catch (error) {
        console.error('❌ Error initializing file storage:', error);
        process.exit(1);
    }
};

initializeApp();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});