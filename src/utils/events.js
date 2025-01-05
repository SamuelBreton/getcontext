// Initialisation des événements spéciaux
const specialEvents = [
    { date: "2024-11-29", label: "Black Friday" },
    { date: "2024-12-25", label: "Christmas" },
    { date: "2025-01-01", label: "New Year" },
    { date: "2025-01-06", label: "Epiphany" },
    { date: "2025-02-14", label: "Valentine's Day" },
    { date: "2025-03-17", label: "St. Patrick's Day" },
    { date: "2025-04-18", label: "Easter" },
    { date: "2025-05-01", label: "May Day" },
    { date: "2025-05-08", label: "Victory in Europe Day" },
    { date: "2025-05-26", label: "Whit Monday" },
    { date: "2025-06-09", label: "Pentecost" },
    { date: "2025-06-23", label: "National Day" },
    { date: "2025-07-14", label: "Bastille Day" },
    { date: "2025-08-15", label: "Assumption Day" },
    { date: "2025-11-01", label: "All Saints' Day" },
    { date: "2025-11-11", label: "Armistice Day" },
    { date: "2025-12-25", label: "Christmas" },
    { date: "2025-12-26", label: "St. Stephen's Day" },
    { date: "2025-12-31", label: "New Year's Eve" }
  ];

  function getSpecialEvent(date) {
    const formattedDate = date.toISOString().split("T")[0];
    const event = specialEvents.find(event => event.date === formattedDate);
    return event ? event.label : "none";
  }  

  
  module.exports = {
    getSpecialEvent
  };