import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DATA_DIR = path.join(process.cwd(), "data");
const NUMEROLOGY_DIR = path.join(DATA_DIR, "numerology");
const USERS_DIR = path.join(DATA_DIR, "users");

// Ensure data directories exist
async function initializeStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(NUMEROLOGY_DIR, { recursive: true });
    await fs.mkdir(USERS_DIR, { recursive: true });
    console.log("✅ Data directories initialized");
  } catch (error) {
    console.error("Error initializing storage:", error);
    throw error;
  }
}

// Generic save function
async function saveData(dir: string, data: any): Promise<string> {
  const id = uuidv4();
  const filename = `${id}.json`;
  const filepath = path.join(dir, filename);

  await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  return id;
}

// Generic read function
async function readData(dir: string, id: string): Promise<any> {
  const filepath = path.join(dir, `${id}.json`);
  const data = await fs.readFile(filepath, "utf-8");
  return JSON.parse(data);
}

// Generic find function
async function findData(
  dir: string,
  predicate: (data: any) => boolean
): Promise<any[]> {
  const files = await fs.readdir(dir);
  const results = [];

  for (const file of files) {
    if (file.endsWith(".json")) {
      const data = JSON.parse(await fs.readFile(path.join(dir, file), "utf-8"));
      if (predicate(data)) {
        results.push({ id: file.replace(".json", ""), ...data });
      }
    }
  }

  return results;
}

export const FileStorage = {
  initializeStorage,

  // Numerology operations
  saveNumerology: (data: any) => saveData(NUMEROLOGY_DIR, data),
  getNumerology: (id: string) => readData(NUMEROLOGY_DIR, id),
  findNumerologyByUserId: (userId: string) =>
    findData(NUMEROLOGY_DIR, (data) => data.userId === userId),

  // User operations
  saveUser: (data: any) => saveData(USERS_DIR, data),
  getUser: (id: string) => readData(USERS_DIR, id),
  findUserByEmail: async (email: string) => {
    const users = await findData(USERS_DIR, (data) => data.email === email);
    return users[0] || null;
  },

  async deleteNumerology(id: string): Promise<boolean> {
    try {
      const readings: any = await this.getNumerology(id);
      const filteredReadings = readings.filter((reading: any) => reading.id !== id);
      await fs.writeFile(
        path.join(NUMEROLOGY_DIR, `${id}.json`),
        JSON.stringify(filteredReadings, null, 2)
      );
      return true;
    } catch (error) {
      console.error("Error deleting numerology reading:", error);
      return false;
    }
  },
};
