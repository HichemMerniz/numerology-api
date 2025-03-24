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
        // Get pagination parameters from query strings
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await NumerologyService_1.NumerologyService.getUserNumerologyHistory(userId, page, limit);
        if (result.readings.length === 0) {
            res.json({
                title: "Numerology History",
                message: "No numerology history found",
                readings: [],
                pagination: result.pagination
            });
            return;
        }
        // Transform the results to include readable names
        const readings = result.readings.map(reading => ({
            id: reading.id,
            name: reading.name,
            dob: reading.dob,
            pdfUrl: reading.pdfUrl,
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
            readings,
            pagination: result.pagination
        });
    }
    static async deleteNumerologyReading(req, res) {
        if (!req.user || !req.user.userId) {
            res.status(401).json({ error: "Unauthorized access" });
            return;
        }
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Reading ID is required" });
            return;
        }
        try {
            const result = await NumerologyService_1.NumerologyService.deleteNumerologyReading(id, req.user.userId);
            res.json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }
}
exports.NumerologyController = NumerologyController;
