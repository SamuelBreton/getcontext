const { isPublicHoliday } = require("./holidays");

function getMomentOfDay(hour) {
  return hour >= 22 || hour < 6 ? "night" :
         hour >= 6 && hour < 12 ? "morning" :
         hour >= 12 && hour < 14 ? "noon" :
         hour >= 14 && hour < 18 ? "afternoon" : "evening";
}

function isBusinessHour(date) {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = date.getHours();

  // Vérifier si c'est un jour ouvrable (lundi à vendredi)
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  // Vérifier les horaires de travail
  const isMorning = hour >= 8 && hour < 12;
  const isAfternoon = hour >= 14 && hour < 18;

  return isWeekday && (isMorning || isAfternoon);
}

function calculateRemainingDays(date) {
  const currentYear = date.getFullYear();
  const lastDayOfYear = new Date(currentYear, 11, 31); // 31 décembre
  const diffTime = Math.abs(lastDayOfYear - date);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function isWorkingDay(date) {
  const dayOfWeek = date.getDay();
  // Vérifie si ce n'est pas un weekend (0 = dimanche, 6 = samedi)
  const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
  // Vérifie si ce n'est pas un jour férié
  const notHoliday = !isPublicHoliday(date);
  
  return isWeekday && notHoliday;
}

function isWeekend(date) {
  const dayOfWeek = date.getDay();
  // 0 = dimanche, 6 = samedi
  return dayOfWeek === 0 || dayOfWeek === 6;
}

function isSchoolDay(date) {
  // Un jour d'école est un jour de travail (lundi-vendredi)
  // qui n'est pas pendant les vacances scolaires
  if (!isWorkingDay(date)) {
    return false;
  }

  const month = date.getMonth() + 1; // getMonth() retourne 0-11
  const day = date.getDate();

  // Périodes de vacances scolaires (simplifié - à adapter selon les zones)
  const schoolHolidays = [
    { start: { month: 7, day: 1 }, end: { month: 8, day: 31 } },    // Vacances d'été
    { start: { month: 12, day: 20 }, end: { month: 12, day: 31 } }, // Vacances de Noël
    // Ajoutez d'autres périodes de vacances selon vos besoins
  ];

  // Vérifie si la date est dans une période de vacances
  return !schoolHolidays.some(period => {
    const currentDate = month * 100 + day; // Format MMDD
    const startDate = period.start.month * 100 + period.start.day;
    const endDate = period.end.month * 100 + period.end.day;
    
    return currentDate >= startDate && currentDate <= endDate;
  });
}

module.exports = {
  getMomentOfDay,
  isBusinessHour,
  calculateRemainingDays,
  isLeapYear,
  isWorkingDay,
  isWeekend,
  isSchoolDay
};
