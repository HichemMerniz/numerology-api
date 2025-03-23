"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorage = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const DATA_DIR = path_1.default.join(process.cwd(), 'data');
const NUMEROLOGY_DIR = path_1.default.join(DATA_DIR, 'numerology');
const USERS_DIR = path_1.default.join(DATA_DIR, 'users');
// Ensure data directories exist
async function initializeStorage() {
    try {
        await promises_1.default.mkdir(DATA_DIR, { recursive: true });
        await promises_1.default.mkdir(NUMEROLOGY_DIR, { recursive: true });
        await promises_1.default.mkdir(USERS_DIR, { recursive: true });
        console.log('✅ Data directories initialized');
    }
    catch (error) {
        console.error('Error initializing storage:', error);
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
    const data = await promises_1.default.readFile(filepath, 'utf-8');
    return JSON.parse(data);
}
// Generic find function
async function findData(dir, predicate) {
    const files = await promises_1.default.readdir(dir);
    const results = [];
    for (const file of files) {
        if (file.endsWith('.json')) {
            const data = JSON.parse(await promises_1.default.readFile(path_1.default.join(dir, file), 'utf-8'));
            if (predicate(data)) {
                results.push({ id: file.replace('.json', ''), ...data });
            }
        }
    }
    return results;
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
    }
};
