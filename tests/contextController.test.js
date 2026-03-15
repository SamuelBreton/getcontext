const { generateContext } = require('../src/controllers/contextController');

// Timestamps UTC fixes
const WINTER_NIGHT   = 1736978400; // Mercredi 15 jan 2025 22:00:00 UTC
const WINTER_MORNING = 1736935200; // Mercredi 15 jan 2025 10:00:00 UTC
const WEEKEND        = 1736589600; // Samedi   11 jan 2025 10:00:00 UTC
const NEW_YEAR       = 1735725600; // Mercredi  1 jan 2025 10:00:00 UTC (Jour de l'An)
const SPRING         = 1744624800; // Lundi    14 avr 2025 10:00:00 UTC
const SUMMER         = 1752487200; // Mardi    15 juil 2025 10:00:00 UTC
const AUTUMN         = 1760353200; // Lundi    13 oct 2025 09:00:00 UTC
const YEAR_2024      = 1704067200; // Lundi     1 jan 2024 00:00:00 UTC (année bissextile)

describe('generateContext — structure de la réponse', () => {
  test('retourne tous les champs requis', () => {
    const context = generateContext();
    const fields = [
      'date', 'time', 'timestamp', 'completeDay',
      'year', 'month', 'day', 'hour',
      'weekOfMonth', 'weekOfYear', 'dayOfWeek',
      'momentOfDay', 'season', 'quarter',
      'isHoliday', 'specialEvent',
      'timezone', 'utcOffset',
      'businessHour', 'remainingDaysInYear',
      'isLeapYear', 'isWorkingDay', 'isWeekend', 'isSchoolDay'
    ];
    fields.forEach(field => expect(context).toHaveProperty(field));
  });

  test('date est au format YYYY-MM-DD', () => {
    const { date } = generateContext(WINTER_NIGHT);
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('time est au format HH:mm:ss', () => {
    const { time } = generateContext(WINTER_NIGHT);
    expect(time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  test('retourne les bonnes valeurs pour le timestamp de référence', () => {
    const ctx = generateContext(WINTER_NIGHT);
    expect(ctx.timestamp).toBe(WINTER_NIGHT);
    expect(ctx.year).toBe(2025);
    expect(ctx.month).toBe(1);
    expect(ctx.day).toBe(15);
  });
});

describe('generateContext — validation', () => {
  test('lève une erreur pour un timestamp invalide (string)', () => {
    expect(() => generateContext('invalid')).toThrow('Invalid timestamp format');
  });
  test('lève une erreur pour un timestamp négatif', () => {
    expect(() => generateContext(-1)).toThrow('Invalid timestamp format');
  });
});

describe('generateContext — saisons', () => {
  test('janvier → winter', () => expect(generateContext(WINTER_NIGHT).season).toBe('winter'));
  test('avril → spring',  () => expect(generateContext(SPRING).season).toBe('spring'));
  test('juillet → summer', () => expect(generateContext(SUMMER).season).toBe('summer'));
  test('octobre → autumn', () => expect(generateContext(AUTUMN).season).toBe('autumn'));
});

describe('generateContext — trimestres', () => {
  test('janvier → Q1', () => expect(generateContext(WINTER_NIGHT).quarter).toBe(1));
  test('avril → Q2',   () => expect(generateContext(SPRING).quarter).toBe(2));
  test('juillet → Q3', () => expect(generateContext(SUMMER).quarter).toBe(3));
  test('octobre → Q4', () => expect(generateContext(AUTUMN).quarter).toBe(4));
});

describe('generateContext — momentOfDay', () => {
  test('22h → night',   () => expect(generateContext(WINTER_NIGHT).momentOfDay).toBe('night'));
  test('10h → morning', () => expect(generateContext(WINTER_MORNING).momentOfDay).toBe('morning'));
});

describe('generateContext — weekend et jours ouvrables', () => {
  test('samedi est weekend et non ouvrable', () => {
    const ctx = generateContext(WEEKEND);
    expect(ctx.isWeekend).toBe(true);
    expect(ctx.isWorkingDay).toBe(false);
  });
  test('mercredi ordinaire n\'est pas weekend et est ouvrable', () => {
    const ctx = generateContext(WINTER_MORNING);
    expect(ctx.isWeekend).toBe(false);
    expect(ctx.isWorkingDay).toBe(true);
  });
});

describe('generateContext — jours fériés', () => {
  test('1er janvier → isHoliday = "yes"', () => {
    expect(generateContext(NEW_YEAR).isHoliday).toBe('yes');
  });
  test('1er janvier → isWorkingDay = false', () => {
    expect(generateContext(NEW_YEAR).isWorkingDay).toBe(false);
  });
  test('1er janvier → specialEvent = "New Year"', () => {
    expect(generateContext(NEW_YEAR).specialEvent).toBe('New Year');
  });
  test('mercredi ordinaire → isHoliday = "no"', () => {
    expect(generateContext(WINTER_MORNING).isHoliday).toBe('no');
  });
  test('mercredi ordinaire → specialEvent = "none"', () => {
    expect(generateContext(WINTER_MORNING).specialEvent).toBe('none');
  });
});

describe('generateContext — année bissextile', () => {
  test('2024 est bissextile', () => {
    expect(generateContext(YEAR_2024).isLeapYear).toBe(true);
  });
  test('2025 n\'est pas bissextile', () => {
    expect(generateContext(WINTER_NIGHT).isLeapYear).toBe(false);
  });
});

describe('generateContext — cache', () => {
  test('bypassCache=true et false retournent le même timestamp', () => {
    const c1 = generateContext(WINTER_NIGHT, 'agent', false);
    const c2 = generateContext(WINTER_NIGHT, 'agent', true);
    expect(c1.timestamp).toBe(c2.timestamp);
    expect(c1.season).toBe(c2.season);
  });
});
