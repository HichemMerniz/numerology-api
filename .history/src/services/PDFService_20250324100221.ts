import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

interface NumerologyData {
  name: string;
  dob: string;
  lifePath: number;
  expression: number;
  soulUrge: number;
}

export class PDFService {
  private static readonly REPORTS_DIR = "../reports";

  static async generateNumerologyPDF(data: NumerologyData, filename: string): Promise<string> {
    // Ensure the reports directory exists
    if (!fs.existsSync(this.REPORTS_DIR)) {
      fs.mkdirSync(this.REPORTS_DIR, { recursive: true });
    }

    const filePath = path.join(this.REPORTS_DIR, filename);
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      bufferPages: true,
    });

    // Create write stream
    const writeStream = fs.createWriteStream(filePath);
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