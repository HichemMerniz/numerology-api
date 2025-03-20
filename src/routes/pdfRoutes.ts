import express, { Router, Request, Response, NextFunction } from "express";
import { PDFController } from "../controllers/PDFController";
// import { protect as authMiddleware } from "@/middleware/auth";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

/**
 * @route   POST /api/pdf/generate
 * @desc    Generate PDF report
 * @access  Private
 */
const handlePDFGeneration = (req: Request, res: Response, next: NextFunction): void => {
    PDFController.generatePDF(req, res).catch(next);
};

router.post("/generate", authMiddleware, handlePDFGeneration);

export default router;