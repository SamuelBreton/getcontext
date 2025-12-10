// dotenv est maintenant chargé dans server.js avant l'import de ce module
// On vérifie juste si dotenv a déjà été chargé pour éviter les erreurs
if (!process.env.DOTENV_LOADED) {
  try {
    require('dotenv').config();
  } catch (e) {
    // dotenv peut ne pas être nécessaire si les variables sont déjà définies
  }
}

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  cacheTTL: parseInt(process.env.CACHE_TTL) || 60,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.getcontext.dev',
  logLevel: process.env.LOG_LEVEL || 'info'
};

