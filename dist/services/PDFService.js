"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class PDFService {
    static async generateNumerologyPDF(data, filename) {
        // Ensure the reports directory exists
        if (!fs_1.default.existsSync(this.REPORTS_DIR)) {
            fs_1.default.mkdirSync(this.REPORTS_DIR, { recursive: true });
        }
        const filePath = path_1.default.join(this.REPORTS_DIR, filename);
        const doc = new pdfkit_1.default({
            size: "A4",
            margin: 50,
            bufferPages: true,
        });
        // Create write stream
        const writeStream = fs_1.default.createWriteStream(filePath);
        doc.pipe(writeStream);
        doc.fontSize(20).text("Numerology Report", { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Name: ${data.name}`);
        doc.text(`Date of Birth: ${data.dob}`);
        doc.text(`Life Path Number: ${data.lifePath}`);
        doc.text(`Expression Number: ${data.expression}`);
        doc.text(`Soul Urge Number: ${data.soulUrge}`);
        // Finalize the PDF
        doc.end();
        // Return the absolute file path
        return filePath;
    }
}
exports.PDFService = PDFService;
PDFService.REPORTS_DIR = "../../reports";
