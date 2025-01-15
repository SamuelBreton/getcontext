// Initialisation des jours fériés et périodes de vacances (France)
const publicHolidays = [
  "2024-01-01", "2024-05-01", "2024-05-08", "2024-07-14", 
  "2024-08-15", "2024-11-01", "2024-11-11", "2024-12-25"
];

// Structure pour les périodes de vacances
const holidayPeriods = [
  { start: "2024-02-01", end: "2024-02-15" }, // Vacances de février
  { start: "2024-04-01", end: "2024-04-15" }, // Vacances de Pâques
  { start: "2024-07-06", end: "2024-09-02" }, // Vacances d'été
  { start: "2024-12-21", end: "2025-01-06" }  // Vacances de Noël
];

function isWithinPeriod(date, start, end) {
  const checkDate = date.toISOString().split('T')[0];
  return checkDate >= start && checkDate <= end;
}

function isPublicHoliday(date) {
  const formattedDate = date.toISOString().split('T')[0];
  
  // Vérifier si c'est un jour férié
  if (publicHolidays.includes(formattedDate)) {
    return true;
  }

  // Vérifier si la date est dans une période de vacances
  return holidayPeriods.some(period => 
    isWithinPeriod(date, period.start, period.end)
  );
}

// Exporter les fonctions et les constantes
module.exports = {
  isPublicHoliday,
  holidayPeriods,
  isWithinPeriod,
  publicHolidays
};