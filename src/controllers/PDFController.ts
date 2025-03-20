import { Request, Response } from "express";
import { PDFService } from "../services/PDFService";
import { NumerologyService } from "../services/NumerologyService";

export class PDFController {
  static async generatePDF(req: Request, res: Response): Promise<void> {
    const { name, dob } = req.body;

    if (!name || !dob) {
      res.status(400).json({ error: "Name and DOB are required" });
      return;
    }

    const data = await NumerologyService.calculateNumerology(name, dob);
    const filename = `numerology_report_${Date.now()}.pdf`;
    const filePath = await PDFService.generateNumerologyPDF(data, filename);

    res.json({ success: true, file: filePath });
  }
}