function getMomentOfDay(hour) {
    return hour >= 22 || hour < 6 ? "night" :
           hour >= 6 && hour < 12 ? "morning" :
           hour >= 12 && hour < 14 ? "noon" :
           hour >= 14 && hour < 18 ? "afternoon" : "evening";
  }
  
  module.exports = {
    getMomentOfDay
  };