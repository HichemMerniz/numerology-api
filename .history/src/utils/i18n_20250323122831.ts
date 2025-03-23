import { Request } from 'express';

// Define translation interfaces
interface TranslationKey {
  [key: string]: string;
}

interface Translations {
  [locale: string]: TranslationKey;
}

// Define the translations
const translations: Translations = {
  en: {
    // Auth
    "user_registered": "User registered successfully",
    "invalid_credentials": "Invalid credentials",
    "user_exists": "User already exists",
    
    // Numerology
    "numerology_calculated": "Numerology calculated successfully",
    "name_dob_required": "Name and date of birth are required",
    "history_title": "Numerology History",
    "no_history": "No numerology history found",
    
    // Numerology readings
    "life_path": "Life Path Number",
    "expression": "Expression Number",
    "soul_urge": "Soul Urge Number",
    
    // PDF
    "pdf_generated": "PDF report generated successfully",
    "numerology_report": "Numerology Report",
    
    // Generic
    "error_occurred": "An error occurred",
    "not_found": "Resource not found",
    "unauthorized": "Unauthorized access",
  },
  fr: {
    // Auth
    "user_registered": "Utilisateur enregistré avec succès",
    "invalid_credentials": "Identifiants invalides",
    "user_exists": "L'utilisateur existe déjà",
    
    // Numerology
    "numerology_calculated": "Numérologie calculée avec succès",
    "name_dob_required": "Le nom et la date de naissance sont requis",
    "history_title": "Historique de Numérologie",
    "no_history": "Aucun historique de numérologie trouvé",
    
    // Numerology readings
    "life_path": "Nombre du Chemin de Vie",
    "expression": "Nombre d'Expression",
    "soul_urge": "Nombre d'Impulsion de l'Âme",
    
    // PDF
    "pdf_generated": "Rapport PDF généré avec succès",
    "numerology_report": "Rapport de Numérologie",
    
    // Generic
    "error_occurred": "Une erreur s'est produite",
    "not_found": "Ressource non trouvée",
    "unauthorized": "Accès non autorisé",
  }
};

/**
 * Get translation for a key based on locale
 * @param key Translation key
 * @param locale Locale code (en, fr)
 * @returns Translated text or the key itself if translation not found
 */
export function translate(key: string, locale: string = 'en'): string {
  // Default to English if requested locale doesn't exist
  const currentLocale = translations[locale] ? locale : 'en';
  
  // Return translation or key if not found
  return translations[currentLocale][key] || key;
}

/**
 * Get locale from request
 * Checks Accept-Language header or query parameter
 * @param req Express request
 * @returns Locale code (en, fr)
 */
export function getLocale(req: Request): string {
  // Check query parameter first
  const queryLocale = req.query.lang as string;
  if (queryLocale && ['en', 'fr'].includes(queryLocale)) {
    return queryLocale;
  }
  
  // Check Accept-Language header
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    // Simple parsing of Accept-Language, could be more sophisticated
    if (acceptLanguage.startsWith('fr')) {
      return 'fr';
    }
  }
  
  // Default to English
  return 'en';
}

// Export as object for easier imports
export const i18n = {
  translate,
  getLocale
}; 