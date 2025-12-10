const NodeCache = require("node-cache");
const { cacheTTL } = require('../config/env');

class ContextCache {
  constructor(ttl = cacheTTL) {
    this.cache = new NodeCache({ 
      stdTTL: ttl,
      checkperiod: ttl * 0.2,
      useClones: false,
      deleteOnExpire: true
    });
  }

  getKey(timestamp) {
    if (!timestamp) {
      // Pour le temps actuel, utiliser une clé qui expire chaque minute
      const now = new Date();
      return `now_${now.getFullYear()}_${now.getMonth()}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}`;
    }
    return `ts_${timestamp}`;
  }

  get(timestamp) {
    const key = this.getKey(timestamp);
    return this.cache.get(key);
  }

  set(timestamp, data) {
    const key = this.getKey(timestamp);
    this.cache.set(key, data);
  }

  // Méthode pour obtenir les statistiques du cache
  getStats() {
    return this.cache.getStats();
  }

  // Méthode pour vider le cache
  flush() {
    this.cache.flushAll();
  }
}

module.exports = ContextCache;

