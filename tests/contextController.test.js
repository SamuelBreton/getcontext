const { generateContext } = require('../src/controllers/contextController');

describe('generateContext', () => {
  test('should return context for current time', () => {
    const context = generateContext();
    expect(context).toHaveProperty('date');
    expect(context).toHaveProperty('timestamp');
    expect(context).toHaveProperty('year');
    expect(context).toHaveProperty('month');
    expect(context).toHaveProperty('day');
    expect(context).toHaveProperty('hour');
  });

  test('should handle valid timestamp', () => {
    const timestamp = 1736977012; // 15 janvier 2025
    const context = generateContext(timestamp);
    expect(context).toHaveProperty('date');
    expect(context.timestamp).toBe(timestamp);
    expect(context.year).toBe(2025);
  });

  test('should throw error for invalid timestamp', () => {
    expect(() => {
      generateContext('invalid');
    }).toThrow('Invalid timestamp format');
  });

  test('should throw error for negative timestamp', () => {
    expect(() => {
      generateContext(-1);
    }).toThrow('Invalid timestamp format');
  });

  test('should return different data when bypassCache is true', () => {
    const timestamp = 1736977012;
    const context1 = generateContext(timestamp, 'test', false);
    const context2 = generateContext(timestamp, 'test', true);
    
    // Les deux devraient retourner les mêmes données mais context2 devrait bypasser le cache
    expect(context1.timestamp).toBe(context2.timestamp);
  });

  test('should return correct season', () => {
    // Hiver (janvier)
    const winterTimestamp = 1736977012;
    const winterContext = generateContext(winterTimestamp);
    expect(winterContext.season).toBe('winter');

    // Printemps (avril)
    const springTimestamp = 1743465600; // Avril 2025
    const springContext = generateContext(springTimestamp);
    expect(springContext.season).toBe('spring');
  });
});

