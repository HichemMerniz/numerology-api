"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFController = void 0;
const PDFService_1 = require("../services/PDFService");
const NumerologyService_1 = require("../services/NumerologyService");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class PDFController {
    static async generatePDF(req, res) {
        try {
            const { name, dob } = req.body;
            if (!name || !dob) {
                res.status(400).json({ error: "Name and DOB are required" });
                return;
            }
            const data = await NumerologyService_1.NumerologyService.calculateNumerology(name, dob);
            const filename = `numerology_report_${Date.now()}.pdf`;
            const filePath = await PDFService_1.PDFService.generateNumerologyPDF(data, filename);
            res.json({
                success: true,
                file: filePath,
                message: "PDF generated successfully"
            });
        }
        catch (error) {
            console.error("Error generating PDF:", error);
            res.status(500).json({
                success: false,
                error: "Failed to generate PDF"
            });
        }
    }
    static async downloadPDF(req, res) {
        try {
            const { filename } = req.params;
            if (!filename) {
                res.status(400).json({
                    status: "error",
                    message: "Filename parameter is required"
                });
                return;
            }
            const filePath = path_1.default.join(this.REPORTS_DIR, `${filename}.pdf`);
            console.log("Attempting to download PDF from:", filePath);
            // Check if file exists
            if (!fs_1.default.existsSync(filePath)) {
                res.status(404).json({
                    status: "error",
                    message: `Cannot find PDF file: ${filename}.pdf on this server!`
                });
                return;
            }
            // Set headers for file download
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);
            // Stream the file
            const fileStream = fs_1.default.createReadStream(filePath);
            fileStream.pipe(res);
            // Handle errors
            fileStream.on("error", (error) => {
                console.error("Error streaming PDF:", error);
                if (!res.headersSent) {
                    res.status(500).json({
                        status: "error",
                        message: "Error downloading PDF"
                    });
                }
            });
        }
        catch (error) {
            console.error("Error handling PDF download:", error);
            if (!res.headersSent) {
                res.status(500).json({
                    status: "error",
                    message: "Failed to process download request"
                });
            }
        }
    }
    static async serveReport(req, res) {
        try {
            const { id } = req.params;
            const filePath = path_1.default.join(this.REPORTS_DIR, `${id}.pdf`);
            console.log("Looking for PDF at:", filePath);
            // Check if file exists
            if (!fs_1.default.existsSync(filePath)) {
                res.status(404).json({
                    status: "error",
                    message: `Cannot find reports/${id}.pdf on this server!`
                });
                return;
            }
            // Set headers for serving PDF
            res.setHeader("Content-Type", "application/pdf");
            // Stream the file
            const fileStream = fs_1.default.createReadStream(filePath);
            fileStream.pipe(res);
            // Handle errors
            fileStream.on("error", (error) => {
                console.error("Error streaming PDF:", error);
                if (!res.headersSent) {
                    res.status(500).json({
                        status: "error",
                        message: "Error serving PDF"
                    });
                }
            });
        }
        catch (error) {
            console.error("Error serving PDF:", error);
            if (!res.headersSent) {
                res.status(500).json({
                    status: "error",
                    message: "Failed to serve PDF"
                });
            }
        }
    }
}
exports.PDFController = PDFController;
PDFController.REPORTS_DIR = path_1.default.join(process.cwd(), "data", "reports");
