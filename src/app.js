const express = require("express");
const compression = require("compression");
const cors = require("cors");
const contextRoutes = require("./routes/context");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { corsOrigin } = require('./config/env');

const app = express();

// Trust proxy pour obtenir la vraie IP derrière un reverse proxy
app.set('trust proxy', 1);

// Compression pour toutes les réponses
app.use(compression());

// Middleware CORS pour les appels externes
app.use(cors({
  origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
  credentials: true
}));

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging des requêtes
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { 
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  next();
});

// Charger le fichier swagger.yaml
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Configuration de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Context API Documentation"
}));

// Ajout des routes
app.use("/v1", contextRoutes);

// Route de santé (health check)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Math.floor(Date.now() / 1000),
    uptime: process.uptime()
  });
});

// Gestion des routes non trouvées
app.use(notFoundHandler);

// Gestion des erreurs (doit être le dernier middleware)
app.use(errorHandler);

module.exports = app;
