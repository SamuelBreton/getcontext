// Initialisation des jours fériés (France)
const publicHolidays = [
    "2024-01-01", "2024-04-01", "2024-05-01", "2024-05-08", "2024-05-09",
    "2024-05-20", "2024-07-14", "2024-08-15", "2024-11-01", "2024-11-11", "2024-12-25"
  ];
  
  function isPublicHoliday(date) {
    const formattedDate = date.toISOString().split("T")[0];
    return publicHolidays.includes(formattedDate);
  }

  module.exports = {
    isPublicHoliday
  };