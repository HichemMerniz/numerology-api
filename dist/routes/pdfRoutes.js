"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PDFController_1 = require("../controllers/PDFController");
// import { protect as authMiddleware } from "@/middleware/auth";
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
/**
 * @route   POST /api/pdf/generate
 * @desc    Generate PDF report
 * @access  Private
 */
const handlePDFGeneration = (req, res, next) => {
    PDFController_1.PDFController.generatePDF(req, res).catch(next);
};
/**
 * @route   GET /api/pdf/download/:filename
 * @desc    Download generated PDF file by ID (without .pdf extension)
 * @access  Public
 */
const handlePDFDownload = (req, res, next) => {
    PDFController_1.PDFController.downloadPDF(req, res).catch(next);
};
/**
 * @route   GET /api/reports/:id
 * @desc    Serve generated PDF file by ID (without .pdf extension)
 * @access  Public
 */
const handleServeReport = (req, res, next) => {
    PDFController_1.PDFController.serveReport(req, res).catch(next);
};
router.post("/pdf/generate", authMiddleware_1.authMiddleware, handlePDFGeneration);
router.get("/pdf/download/:filename", handlePDFDownload);
router.get("/reports/:id", handleServeReport);
exports.default = router;
