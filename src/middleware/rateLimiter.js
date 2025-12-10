const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  message: {
    error: 'Too many requests',
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter plus strict pour les requêtes avec bypassCache
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    error: 'Too many requests',
    message: 'Limite de requêtes dépassée pour bypassCache. Veuillez réessayer plus tard.'
  }
});

module.exports = {
  limiter,
  strictLimiter
};

