// Charger dotenv en premier avant tout autre import
require('dotenv').config();

const app = require("./app");
const { port } = require("./config/env");
const logger = require("./utils/logger");

app.listen(port, () => {
  logger.info(`Serveur démarré sur http://localhost:${port}/v1/context`);
  logger.info(`Documentation Swagger disponible sur http://localhost:${port}/api-docs`);
  logger.info(`Health check disponible sur http://localhost:${port}/health`);
});

