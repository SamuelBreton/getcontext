const express = require("express");
const compression = require("compression");
const cors = require("cors");
const contextRoutes = require("./routes/context");

const app = express();

// Compression pour toutes les réponses
app.use(compression());

// Middleware CORS pour les appels externes
app.use(cors());

// Ajout des routes
app.use("/v1", contextRoutes);

module.exports = app;
