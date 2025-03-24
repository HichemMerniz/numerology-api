import { FileStorage } from '../utils/fileStorage';
import crypto from 'crypto';

const letterToNumber: { [key: string]: number } = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

function reduceToSingleDigit(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split("").reduce((sum, digit) => sum + Number(digit), 0);
  }
  return num;
}

function getNameValue(name: string): number {
  return name.toUpperCase().replace(/[^A-Z]/g, "").split("").reduce((sum, letter) => {
    return sum + (letterToNumber[letter] || 0);
  }, 0);
}

function getLifePathNumber(dob: string): number {
  const digits = dob.replace(/-/g, "").split("").map(Number);
  return reduceToSingleDigit(digits.reduce((sum, n) => sum + n, 0));
}

function getExpressionNumber(name: string): number {
  return reduceToSingleDigit(getNameValue(name));
}

function getSoulUrgeNumber(name: string): number {
  const vowels = name.toUpperCase().replace(/[^AEIOUY]/g, "");
  return reduceToSingleDigit(getNameValue(vowels));
}

export class NumerologyService {
  static async calculateNumerology(name: string, dob: string, userId?: string) {
    // Generate a unique ID (could use UUID or another method)
    const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    
    const numerologyData = {
      id,
      name,
      dob,
      lifePath: getLifePathNumber(dob),
      expression: getExpressionNumber(name),
      soulUrge: getSoulUrgeNumber(name),
      userId,
      createdAt: new Date().toISOString()
    };

    // Save to file storage
    await FileStorage.saveNumerology(numerologyData);
    return numerologyData;
  }

  static async getUserNumerologyHistory(userId: string, page = 1, limit = 10) {
    const readings = await FileStorage.findNumerologyByUserId(userId);
    
    // Sort by date descending
    const sortedReadings = readings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Calculate pagination values
    const totalItems = sortedReadings.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Return paginated results and pagination metadata
    return {
      readings: sortedReadings.slice(startIndex, endIndex),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      }
    };
  }

  static async deleteNumerologyReading(id: string, userId: string) {
    const reading = await FileStorage.findNumerologyById(id);
    if (!reading) {
      throw new Error('Reading not found');
    }
    if (reading.userId !== userId) {
      throw new Error('Unauthorized to delete this reading');
    }
    await FileStorage.deleteNumerology(id);
    return { message: 'Reading deleted successfully' };
  }
}