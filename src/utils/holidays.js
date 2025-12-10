const { getHolidays, getHolidayPeriods } = require('../config/holidays');

function isWithinPeriod(date, start, end) {
  const checkDate = date.toISOString().split('T')[0];
  return checkDate >= start && checkDate <= end;
}

function isPublicHoliday(date, country = 'FR') {
  const formattedDate = date.toISOString().split('T')[0];
  const year = date.getFullYear();
  
  // Récupérer les jours fériés pour le pays et l'année
  const publicHolidays = getHolidays(country, year);
  
  // Vérifier si c'est un jour férié
  if (publicHolidays.includes(formattedDate)) {
    return true;
  }

  // Vérifier si la date est dans une période de vacances
  const periods = getHolidayPeriods(country, year);
  return periods.some(period => 
    isWithinPeriod(date, period.start, period.end)
  );
}

module.exports = {
  isPublicHoliday,
  isWithinPeriod
};