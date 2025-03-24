/**
 * Numerology Routes
 * Handles all numerology-related endpoints
 */

import express, { Router, Request, Response, NextFunction } from "express";
import { NumerologyController } from "../controllers/NumerologyController";
// import { protect as authMiddleware } from "@/middleware/auth";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

/**
 * @route   POST /api/numerology
 * @desc    Calculate numerology based on name and date of birth
 * @access  Private
 */
const handleNumerology = (req: Request, res: Response, next: NextFunction): void => {
    NumerologyController.getNumerology(req, res).catch(next);
};

/**
 * @route   GET /api/numerology/history
 * @desc    Get user's numerology calculation history
 * @params  page - Page number (default: 1)
 * @params  limit - Items per page (default: 10)
 * @access  Private
 */
const handleNumerologyHistory = (req: Request, res: Response, next: NextFunction): void => {
    // console.log("dekhal");
    NumerologyController.getNumerologyHistory(req, res).catch(next);
};

/**
 * @route   DELETE /api/numerology/:id
 * @desc    Delete a single numerology reading by ID
 * @access  Private
 */
const handleDeleteNumerology = (req: Request, res: Response, next: NextFunction): void => {
    NumerologyController.deleteNumerologyReading(req, res).catch(next);
};

// Routes
router.post("/", authMiddleware, handleNumerology);
router.get("/history", authMiddleware, handleNumerologyHistory);
router.delete("/:id", authMiddleware, handleDeleteNumerology);

export default router;