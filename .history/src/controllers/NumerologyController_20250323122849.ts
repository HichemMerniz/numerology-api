import { Request, Response } from "express";
import { NumerologyService } from "../services/NumerologyService";
import { i18n } from "../utils/i18n";

interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export class NumerologyController {
  static async getNumerology(req: Request, res: Response): Promise<void> {
    const { name, dob } = req.body;
    const locale = i18n.getLocale(req);

    if (!name || !dob) {
      res.status(400).json({ error: i18n.translate("name_dob_required", locale) });
      return;
    }

    // Get user ID from authenticated request if available
    const userId = (req as AuthRequest).user?.userId;
    
    const result = await NumerologyService.calculateNumerology(name, dob, userId);
    res.json({
      message: i18n.translate("numerology_calculated", locale),
      ...result,
      // Translate the reading names
      readings: {
        lifePath: {
          name: i18n.translate("life_path", locale),
          value: result.lifePath
        },
        expression: {
          name: i18n.translate("expression", locale),
          value: result.expression
        },
        soulUrge: {
          name: i18n.translate("soul_urge", locale),
          value: result.soulUrge
        }
      }
    });
  }
  
  static async getNumerologyHistory(req: AuthRequest, res: Response): Promise<void> {
    const locale = i18n.getLocale(req);
    
    // Ensure user is authenticated
    if (!req.user || !req.user.userId) {
      res.status(401).json({ error: i18n.translate("unauthorized", locale) });
      return;
    }
    
    const userId = req.user.userId;
    const history = await NumerologyService.getUserNumerologyHistory(userId);
    
    if (history.length === 0) {
      res.json({
        title: i18n.translate("history_title", locale),
        message: i18n.translate("no_history", locale),
        readings: []
      });
      return;
    }
    
    // Transform the results to include translations
    const readings = history.map(reading => ({
      id: reading.id,
      name: reading.name,
      dob: reading.dob,
      createdAt: reading.createdAt,
      readings: {
        lifePath: {
          name: i18n.translate("life_path", locale),
          value: reading.lifePath
        },
        expression: {
          name: i18n.translate("expression", locale),
          value: reading.expression
        },
        soulUrge: {
          name: i18n.translate("soul_urge", locale),
          value: reading.soulUrge
        }
      }
    }));
    
    res.json({
      title: i18n.translate("history_title", locale),
      readings
    });
  }
}