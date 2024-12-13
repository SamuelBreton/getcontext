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

module.exports = {
  getMomentOfDay,
  isBusinessHour
};
