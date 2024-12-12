const express = require("express");
const app = express();
const cors = require("cors");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 }); // Cache pour 60 secondes

const compression = require("compression");
app.use(compression());
app.use(cors());


const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// Initialisation des jours fériés (France)
const publicHolidays = [
  "2024-01-01", "2024-04-01", "2024-05-01", "2024-05-08", "2024-05-09",
  "2024-05-20", "2024-07-14", "2024-08-15", "2024-11-01", "2024-11-11", "2024-12-25"
];

// Initialisation des événements spéciaux
const specialEvents = [
  { date: "2024-11-29", label: "Black Friday" },
  { date: "2024-12-25", label: "Christmas" }
];

function isPublicHoliday(date) {
  const formattedDate = date.toISOString().split("T")[0];
  return publicHolidays.includes(formattedDate);
}

function getSpecialEvent(date) {
  const formattedDate = date.toISOString().split("T")[0];
  const event = specialEvents.find(event => event.date === formattedDate);
  return event ? event.label : "none";
}


function generateContext(timestamp, userAgent) {
  const date = timestamp ? new Date(parseInt(timestamp, 10)) : new Date();
  if (isNaN(date.getTime())) {
    return { error: "Invalid timestamp format. Provide a valid UNIX timestamp." };
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const weekOfMonth = Math.ceil((day + new Date(year, month - 1, 1).getDay()) / 7);
  const momentOfDay = hour >= 22 || hour < 6 ? "night" :
                      hour >= 6 && hour < 12 ? "morning" :
                      hour >= 12 && hour < 14 ? "noon" :
                      hour >= 14 && hour < 18 ? "afternoon" : "evening";

  const contextData = {
    date: date.toISOString().split("T")[0],
    time: date.toTimeString().split(" ")[0],
    year,
    month,
    day,
    hour,
    weekOfMonth,
    dayOfWeek: date.toLocaleDateString(undefined, { weekday: "long" }),
    momentOfDay,
    season: month >= 3 && month <= 5 ? "spring" :
            month >= 6 && month <= 8 ? "summer" :
            month >= 9 && month <= 11 ? "autumn" : "winter",
    isHoliday: isPublicHoliday(date) ? "yes" : "no",
    specialEvent: getSpecialEvent(date),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userAgent,
    weekOfYear: Math.ceil(((date - new Date(date.getFullYear(), 0, 1)) / 86400000 + new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7),
    quarter: Math.ceil((month) / 3)
  };

  return contextData;
}



// Endpoint GET pour l'API
app.get("/api/context", (req, res) => {
  const { timestamp } = req.query;
  const userAgent = req.headers["user-agent"] || "unknown";
  const context = generateContext(timestamp, userAgent);

  if (context.error) {
    return res.status(400).json(context);
  }

  res.json(context);
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API disponible sur http://localhost:${PORT}/api/context`);
});
