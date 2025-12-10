const { query, validationResult } = require('express-validator');

const validateTimestamp = [
  query('timestamp')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true; // timestamp est optionnel
      }
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 0) {
        throw new Error('Timestamp must be a positive integer (UNIX timestamp in seconds)');
      }
      // Vérifier que le timestamp n'est pas trop dans le futur (max 10 ans)
      const maxTimestamp = Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60);
      if (num > maxTimestamp) {
        throw new Error('Timestamp is too far in the future');
      }
      return true;
    }),
  query('bypassCache')
    .optional()
    .isBoolean()
    .withMessage('bypassCache must be a boolean (true or false)')
    .toBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation Error',
        errors: errors.array() 
      });
    }
    next();
  }
];

module.exports = { validateTimestamp };

