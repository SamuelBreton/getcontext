const express = require("express");
const { generateContext } = require("../controllers/contextController");
const { validateTimestamp } = require("../middleware/validators");
const { limiter, strictLimiter } = require("../middleware/rateLimiter");
const logger = require("../utils/logger");
const router = express.Router();

// Middleware pour appliquer le bon rate limiter selon bypassCache
const applyRateLimiter = (req, res, next) => {
  const { bypassCache } = req.query;
  if (bypassCache === 'true' || bypassCache === true) {
    return strictLimiter(req, res, next);
  }
  return limiter(req, res, next);
};

router.get("/context", applyRateLimiter, validateTimestamp, (req, res, next) => {
    try {
      const { timestamp, bypassCache } = req.query;
      const userAgent = req.headers["user-agent"] || "unknown";
      const shouldBypassCache = bypassCache === 'true' || bypassCache === true;
      
      handleContextRequest(req, res, next, timestamp, userAgent, shouldBypassCache);
    } catch (error) {
      next(error);
    }
  });

function handleContextRequest(req, res, next, timestamp, userAgent, bypassCache) {
  try {
    logger.info('Context request', { 
      timestamp: timestamp || 'current', 
      userAgent,
      bypassCache,
      ip: req.ip 
    });
    
    const context = generateContext(timestamp, userAgent, bypassCache);
    
    res.json(context);
  } catch (error) {
    next(error);
  }
}

module.exports = router;