"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorage = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const pdfkit_1 = __importDefault(require("pdfkit"));
const DATA_DIR = path_1.default.join(process.cwd(), "data");
const NUMEROLOGY_DIR = path_1.default.join(DATA_DIR, "numerology");
const USERS_DIR = path_1.default.join(DATA_DIR, "users");
const REPORTS_DIR = path_1.default.join(DATA_DIR, "reports");
// Ensure data directories exist
async function initializeStorage() {
    try {
        await promises_1.default.mkdir(DATA_DIR, { recursive: true });
        await promises_1.default.mkdir(NUMEROLOGY_DIR, { recursive: true });
        await promises_1.default.mkdir(USERS_DIR, { recursive: true });
        await promises_1.default.mkdir(REPORTS_DIR, { recursive: true });
        console.log("✅ Data directories initialized");
    }
    catch (error) {
        console.error("Error initializing storage:", error);
        throw error;
    }
}
// Generic save function
async function saveData(dir, data) {
    const id = (0, uuid_1.v4)();
    const filename = `${id}.json`;
    const filepath = path_1.default.join(dir, filename);
    await promises_1.default.writeFile(filepath, JSON.stringify(data, null, 2));
    return id;
}
// Generic read function
async function readData(dir, id) {
    const filepath = path_1.default.join(dir, `${id}.json`);
    const data = await promises_1.default.readFile(filepath, "utf-8");
    return JSON.parse(data);
}
// Generic find function
async function findData(dir, predicate) {
    const files = await promises_1.default.readdir(dir);
    const results = [];
    for (const file of files) {
        if (file.endsWith(".json")) {
            const data = JSON.parse(await promises_1.default.readFile(path_1.default.join(dir, file), "utf-8"));
            if (predicate(data)) {
                results.push({ id: file.replace(".json", ""), ...data });
            }
        }
    }
    return results;
}
// Add new function to generate PDF
async function generateNumerologyPDF(id, data) {
    const pdfId = (0, uuid_1.v4)();
    const pdfPath = path_1.default.join(REPORTS_DIR, `${pdfId}.pdf`);
    const doc = new pdfkit_1.default();
    // Create write stream
    const writeStream = (0, fs_1.createWriteStream)(pdfPath);
    doc.pipe(writeStream);
    // Add content to PDF
    doc.fontSize(20).text("Numerology Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${data.name}`);
    doc.text(`Date of Birth: ${data.dob}`);
    doc.moveDown();
    doc.text("Your Numbers:");
    doc.text(`Life Path Number: ${data.lifePath}`);
    doc.text(`Expression Number: ${data.expression}`);
    doc.text(`Soul Urge Number: ${data.soulUrge}`);
    doc.moveDown();
    doc.text(`Generated on: ${new Date().toLocaleString()}`);
    // Finalize PDF
    doc.end();
    // Wait for write stream to finish
    await new Promise((resolve) => writeStream.on("finish", () => resolve()));
    // Return the URL path
    return `/api/reports/${pdfId}`; // URL to view the PDF directly
}
// Add update function
async function updateNumerology(id, data) {
    const filepath = path_1.default.join(NUMEROLOGY_DIR, `${id}.json`);
    await promises_1.default.writeFile(filepath, JSON.stringify(data, null, 2));
}
exports.FileStorage = {
    initializeStorage,
    // Numerology operations
    saveNumerology: (data) => saveData(NUMEROLOGY_DIR, data),
    getNumerology: (id) => readData(NUMEROLOGY_DIR, id),
    findNumerologyByUserId: (userId) => findData(NUMEROLOGY_DIR, (data) => data.userId === userId),
    // User operations
    saveUser: (data) => saveData(USERS_DIR, data),
    getUser: (id) => readData(USERS_DIR, id),
    findUserByEmail: async (email) => {
        const users = await findData(USERS_DIR, (data) => data.email === email);
        return users[0] || null;
    },
    async deleteNumerology(id) {
        try {
            const filepath = path_1.default.join(NUMEROLOGY_DIR, `${id}.json`);
            await promises_1.default.unlink(filepath); // Delete the file directly
            return true;
        }
        catch (error) {
            console.error("Error deleting numerology reading:", error);
            return false;
        }
    },
    generateNumerologyPDF,
    updateNumerology,
};
