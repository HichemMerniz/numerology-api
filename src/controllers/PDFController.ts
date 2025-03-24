import { Request, Response } from "express";
import { PDFService } from "../services/PDFService";
import { NumerologyService } from "../services/NumerologyService";
import path from "path";
import fs from "fs";

export class PDFController {
  private static readonly REPORTS_DIR = path.join(process.cwd(), "data", "reports");

  static async generatePDF(req: Request, res: Response): Promise<void> {
    try {
      const { name, dob } = req.body;

      if (!name || !dob) {
        res.status(400).json({ error: "Name and DOB are required" });
        return;
      }

      const data = await NumerologyService.calculateNumerology(name, dob);
      const filename = `numerology_report_${Date.now()}.pdf`;
      const filePath = await PDFService.generateNumerologyPDF(data, filename);

      res.json({ 
        success: true, 
        file: filePath,
        message: "PDF generated successfully" 
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to generate PDF" 
      });
    }
  }

  static async downloadPDF(req: Request, res: Response): Promise<void> {
    try {
      const { filename } = req.params;
      const filePath = path.join(this.REPORTS_DIR, filename);
      console.log(filePath);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ 
          success: false, 
          error: `Cannot find ${filename} on this server!` 
        });
        return;
      }

      // Set headers for file download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      // Handle errors
      fileStream.on("error", (error) => {
        console.error("Error streaming PDF:", error);
        res.status(500).json({ 
          success: false, 
          error: "Error downloading PDF" 
        });
      });
    } catch (error) {
      console.error("Error handling PDF download:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to process download request" 
      });
    }
  }

  static async serveReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const filePath = path.join(this.REPORTS_DIR, `${id}.pdf`);
      
      console.log("Looking for PDF at:", filePath);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ 
          status: "error", 
          message: `Cannot find reports/${id}.pdf on this server!` 
        });
        return;
      }

      // Set headers for serving PDF
      res.setHeader("Content-Type", "application/pdf");
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
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
    } catch (error) {
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