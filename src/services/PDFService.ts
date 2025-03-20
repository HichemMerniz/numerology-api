import PDFDocument from "pdfkit";
import fs from "fs";

export class PDFService {
  static generateNumerologyPDF(data: any, filename: string): string {
    const doc = new PDFDocument();
    const filePath = `/Users/hichemmerniz/Jobs/Project/belkacem project 01/Project/API/numerology-api/reports/${filename}`;
    const stream = fs.createWriteStream(filePath);
    
    doc.pipe(stream);
    
    doc.fontSize(20).text("Numerology Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${data.name}`);
    doc.text(`Date of Birth: ${data.dob}`);
    doc.text(`Life Path Number: ${data.lifePath}`);
    doc.text(`Expression Number: ${data.expression}`);
    doc.text(`Soul Urge Number: ${data.soulUrge}`);
    
    doc.end();

    return filePath;
  }
}