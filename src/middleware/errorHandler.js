const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Erreur de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  // Erreur de format (CastError)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid Input',
      message: 'Invalid timestamp format. Provide a valid UNIX timestamp in seconds.'
    });
  }

  // Erreur personnalisée avec status
  if (err.status) {
    return res.status(err.status).json({
      error: err.message || 'Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Erreur serveur par défaut
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Une erreur est survenue. Veuillez réessayer plus tard.' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware pour gérer les routes non trouvées
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};

