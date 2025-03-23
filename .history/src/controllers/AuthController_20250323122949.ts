import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { i18n } from "../utils/i18n";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const locale = i18n.getLocale(req);
      const result = await AuthService.register(email, password, locale);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const locale = i18n.getLocale(req);
      const result = await AuthService.login(email, password, locale);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}