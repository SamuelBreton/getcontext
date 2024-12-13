const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 }); // Cache pour 60 secondes

const { isPublicHoliday } = require("../utils/holidays");
const { getSpecialEvent } = require("../utils/events");
const { getMomentOfDay } = require("../utils/time");

function generateContext(timestamp, userAgent) {
  // Vérifier si le cache contient déjà les données
  const cacheKey = timestamp || "now";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const date = timestamp ? new Date(parseInt(timestamp, 10)) : new Date();
  if (isNaN(date.getTime())) {
    return { error: "Invalid timestamp format. Provide a valid UNIX timestamp." };
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const weekOfMonth = Math.ceil((day + new Date(year, month - 1, 1).getDay()) / 7);

  const contextData = {
    date: date.toISOString().split("T")[0],
    time: date.toTimeString().split(" ")[0],
    timestamp: date.getTime(),
    year,
    month,
    day,
    hour,
    weekOfMonth,
    dayOfWeek: date.toLocaleDateString(undefined, { weekday: "long" }),
    momentOfDay: getMomentOfDay(hour),
    season: month >= 3 && month <= 5 ? "spring" :
            month >= 6 && month <= 8 ? "summer" :
            month >= 9 && month <= 11 ? "autumn" : "winter",
    isHoliday: isPublicHoliday(date) ? "yes" : "no",
    specialEvent: getSpecialEvent(date),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    utcOffset: date.getTimezoneOffset(),
    userAgent,
    weekOfYear: Math.ceil(((date - new Date(date.getFullYear(), 0, 1)) / 86400000 + new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7),
    quarter: Math.ceil((month) / 3)
  };

  // Stocker les données dans le cache
  cache.set(cacheKey, contextData);

  return contextData;
}

module.exports = {
  generateContext
};
