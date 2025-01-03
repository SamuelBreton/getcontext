const express = require("express");
const compression = require("compression");
const cors = require("cors");
const contextRoutes = require("./routes/context");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

// Compression pour toutes les réponses
app.use(compression());

// Middleware CORS pour les appels externes
app.use(cors());

// Charger le fichier swagger.yaml
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Configuration de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ajout des routes
app.use("/v1", contextRoutes);

module.exports = app;
