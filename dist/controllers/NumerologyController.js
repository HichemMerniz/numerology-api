"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumerologyController = void 0;
const NumerologyService_1 = require("../services/NumerologyService");
class NumerologyController {
    static async getNumerology(req, res) {
        const { name, dob } = req.body;
        if (!name || !dob) {
            res.status(400).json({ error: "Name and DOB are required" });
            return;
        }
        // Get user ID from authenticated request if available
        const userId = req.user?.userId;
        const result = await NumerologyService_1.NumerologyService.calculateNumerology(name, dob, userId);
        res.json({
            message: "Numerology calculated successfully",
            ...result,
            // Add reading names
            readings: {
                lifePath: {
                    name: "Life Path Number",
                    value: result.lifePath
                },
                expression: {
                    name: "Expression Number",
                    value: result.expression
                },
                soulUrge: {
                    name: "Soul Urge Number",
                    value: result.soulUrge
                }
            }
        });
    }
    static async getNumerologyHistory(req, res) {
        // Ensure user is authenticated
        if (!req.user || !req.user.userId) {
            res.status(401).json({ error: "Unauthorized access" });
            return;
        }
        const userId = req.user.userId;
        const history = await NumerologyService_1.NumerologyService.getUserNumerologyHistory(userId);
        if (history.length === 0) {
            res.json({
                title: "Numerology History",
                message: "No numerology history found",
                readings: []
            });
            return;
        }
        // Transform the results to include readable names
        const readings = history.map(reading => ({
            id: reading.id,
            name: reading.name,
            dob: reading.dob,
            createdAt: reading.createdAt,
            readings: {
                lifePath: {
                    name: "Life Path Number",
                    value: reading.lifePath
                },
                expression: {
                    name: "Expression Number",
                    value: reading.expression
                },
                soulUrge: {
                    name: "Soul Urge Number",
                    value: reading.soulUrge
                }
            }
        }));
        res.json({
            title: "Numerology History",
            readings
        });
    }
}
exports.NumerologyController = NumerologyController;
