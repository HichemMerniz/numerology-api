import { FileStorage } from '../utils/fileStorage';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

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
    // Create numerology data without ID first
    const numerologyData = {
      name,
      dob,
      lifePath: getLifePathNumber(dob),
      expression: getExpressionNumber(name),
      soulUrge: getSoulUrgeNumber(name),
      userId,
      createdAt: new Date().toISOString(),
      pdfUrl: null  // Will be updated after PDF generation
    };

    // Save to file storage and get the ID
    const id = await FileStorage.saveNumerology(numerologyData);
    
    // Generate PDF and update URL
    const pdfUrl = await FileStorage.generateNumerologyPDF(id, numerologyData);
    
    const updatedData = { ...numerologyData, pdfUrl };
    await FileStorage.updateNumerology(id, updatedData);
    
    // Return the data with the ID included
    return { id, ...updatedData };
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
    if (!id) {
      throw new Error('Reading ID is required');
    }

    
    const reading = await FileStorage.getNumerology(id);
    if (!reading) {
      throw new Error('Reading not found');
    }
    console.log(reading);
    if (!reading.userId) {
      throw new Error('Reading has no associated user');
    }
    console.log(reading.userId);
    if (reading.userId !== userId) {
      throw new Error('Unauthorized to delete this reading');
    }
    console.log("dekhal");
    const success = await FileStorage.deleteNumerology(id);
    if (!success) {
      throw new Error('Failed to delete reading');
    }
    
    return { message: 'Reading deleted successfully', id };
  }
}