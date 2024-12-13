// Initialisation des événements spéciaux
const specialEvents = [
    { date: "2024-11-29", label: "Black Friday" },
    { date: "2024-12-25", label: "Christmas" }
  ];

  function getSpecialEvent(date) {
    const formattedDate = date.toISOString().split("T")[0];
    const event = specialEvents.find(event => event.date === formattedDate);
    return event ? event.label : "none";
  }  

  
  module.exports = {
    getSpecialEvent
  };