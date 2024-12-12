const express = require("express");
const app = express();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 }); // Cache pour 60 secondes

const compression = require("compression");
app.use(compression());

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// Données statiques de base pour le contexte
const baseContext = {
  deviceType: "Desktop",
  timezone: "Europe/Paris",
  language: "fr-FR",
  screenResolution: "1920x1080",
  connectionType: "4g",
  weather: {
    temperature: 15,
    condition: "clear sky",
    city: "Paris",
  },
};



function generateContext(timestamp) {
  const cachedContext = cache.get(timestamp || "now");
  if (cachedContext) return cachedContext;

  // Générer un contexte si non en cache
  const date = timestamp && timestamp !== "now" ? new Date(parseInt(timestamp, 10)) : new Date();
  const context = {
    timestamp: date.toISOString(),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekOfMonth: Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7),
    dayOfWeek: date.toLocaleDateString("fr-FR", { weekday: "long" }),
    weather: { temperature: 15, condition: "clear sky", city: "Paris" }
  };

  cache.set(timestamp || "now", context);
  return context;
}


// Endpoint GET pour récupérer le contexte
app.get("/api/context", (req, res) => {
  const { timestamp } = req.query;

  // Génération du contexte
  const context = generateContext(timestamp);
  if (context.error) {
    return res.status(400).json(context); // Retourne une erreur si le format est invalide
  }

  res.json(context); // Retourne le contexte léger
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API disponible sur http://localhost:${PORT}/api/context`);
});
