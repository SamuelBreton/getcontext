const ContextCache = require("../utils/cache");
const logger = require("../utils/logger");
const { isPublicHoliday } = require("../utils/holidays");
const { getSpecialEvent } = require("../utils/events");
const { 
  getMomentOfDay, 
  isBusinessHour, 
  calculateRemainingDays, 
  isLeapYear,
  isWorkingDay,
  isWeekend,
  isSchoolDay
} = require("../utils/time");

// Initialiser le cache
const cache = new ContextCache();

function generateContext(timestamp, userAgent, bypassCache = false) {
  try {
    // Vérifier si le cache contient déjà les données
    const cacheKey = timestamp || "now";
    if (!bypassCache) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        if (logger.debug) logger.debug('Cache hit', { cacheKey });
        return cachedData;
      }
    }

    // Amélioration de la gestion du timestamp
    let date;
    if (timestamp) {
      // Gestion des différents formats de timestamp
      const timestampNumber = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
      
      // Vérifier si c'est un timestamp valide
      if (isNaN(timestampNumber) || timestampNumber < 0) {
        throw new Error("Invalid timestamp format. Provide a valid UNIX timestamp in seconds.");
      }
      
      // Conversion du timestamp (secondes) en millisecondes pour le constructeur Date
      date = new Date(timestampNumber * 1000);
    } else {
      date = new Date();
    }

    if (isNaN(date.getTime())) {
      throw new Error("Invalid timestamp format. Provide a valid UNIX timestamp in seconds.");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = date.getHours();
    const weekOfMonth = Math.ceil((day + new Date(year, month - 1, 1).getDay()) / 7);

    const contextData = {
      date: date.toISOString().split("T")[0],
      time: date.toTimeString().split(" ")[0],
      timestamp: Math.floor(date.getTime() / 1000),
      completeDay: date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      year,
      month: parseInt(month),
      day: parseInt(day),
      hour,
      weekOfMonth,
      dayOfWeek: date.toLocaleDateString(undefined, { weekday: "long" }),
      momentOfDay: getMomentOfDay(hour),
      season: month >= 3 && month <= 5 ? "spring" :
              month >= 6 && month <= 8 ? "summer" :
              month >= 9 && month <= 11 ? "autumn" : "winter",
      specialEvent: getSpecialEvent(date),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      utcOffset: date.getTimezoneOffset(),
      weekOfYear: Math.ceil(((date - new Date(date.getFullYear(), 0, 1)) / 86400000 + new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7),
      quarter: Math.ceil((parseInt(month)) / 3),
      businessHour: isBusinessHour(date),
      remainingDaysInYear: calculateRemainingDays(date),
      isLeapYear: isLeapYear(year),
      isWorkingDay: isWorkingDay(date),
      isWeekend: isWeekend(date),
      isSchoolDay: isSchoolDay(date),
      isHoliday: isPublicHoliday(date) ? "yes" : "no"
    };

    // Cache Management
    if (!bypassCache) {
      cache.set(cacheKey, contextData);
      if (logger.debug) logger.debug('Cache set', { cacheKey });
    }
    
    return contextData;
  } catch (error) {
    logger.error('Error generating context', { error: error.message, timestamp, userAgent });
    throw error;
  }
}

module.exports = {
  generateContext
};
