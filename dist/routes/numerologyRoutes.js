"use strict";
/**
 * Numerology Routes
 * Handles all numerology-related endpoints
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NumerologyController_1 = require("../controllers/NumerologyController");
// import { protect as authMiddleware } from "@/middleware/auth";
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
/**
 * @route   POST /api/numerology
 * @desc    Calculate numerology based on name and date of birth
 * @access  Private
 */
const handleNumerology = (req, res, next) => {
    NumerologyController_1.NumerologyController.getNumerology(req, res).catch(next);
};
/**
 * @route   GET /api/numerology/history
 * @desc    Get user's numerology calculation history
 * @params  page - Page number (default: 1)
 * @params  limit - Items per page (default: 10)
 * @access  Private
 */
const handleNumerologyHistory = (req, res, next) => {
    // console.log("dekhal");
    NumerologyController_1.NumerologyController.getNumerologyHistory(req, res).catch(next);
};
/**
 * @route   DELETE /api/numerology/:id
 * @desc    Delete a single numerology reading by ID
 * @access  Private
 */
const handleDeleteNumerology = (req, res, next) => {
    NumerologyController_1.NumerologyController.deleteNumerologyReading(req, res).catch(next);
};
// Routes
router.post("/", authMiddleware_1.authMiddleware, handleNumerology);
router.get("/history", authMiddleware_1.authMiddleware, handleNumerologyHistory);
router.delete("/:id", authMiddleware_1.authMiddleware, handleDeleteNumerology);
exports.default = router;
