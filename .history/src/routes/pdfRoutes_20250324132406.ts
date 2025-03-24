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
const handlePDFGeneration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  PDFController.generatePDF(req, res).catch(next);
};

/**
 * @route   GET /api/pdf/download/:filename
 * @desc    Download generated PDF file
 * @access  Private
 */
const handlePDFDownload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  PDFController.downloadPDF(req, res).catch(next);
};

/**
 * @route   GET /api/reports/:id
 * @desc    Serve generated PDF file
 * @access  Public
 */
const handleServeReport = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  PDFController.serveReport(req, res).catch(next);
};

router.post("/pdf/generate", authMiddleware, handlePDFGeneration);
router.get("/pdf/download/:filename", handlePDFDownload);
router.get("/pdf/reports/:id", handleServeReport);

export default router;
