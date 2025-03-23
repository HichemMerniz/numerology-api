import { Request, Response } from "express";
import { NumerologyService } from "../services/NumerologyService";

export class NumerologyController {
  static async getNumerology(req: Request, res: Response): Promise<void> {
    const { name, dob } = req.body;

    if (!name || !dob) {
      res.status(400).json({ error: "Name and DOB are required" });
      return;
    }

    const result = await NumerologyService.calculateNumerology(name, dob);
    res.json(result);
  }
}