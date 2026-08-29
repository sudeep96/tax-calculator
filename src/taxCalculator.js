/**
 * taxCalculator.js
 *
 * A simple, deterministic, PROGRESSIVE tax calculator built for demonstration
 * purposes only (Cloud Native / DevOps / Agile / NoSQL final project).
 *
 * ASSUMPTIONS (read this before trusting any output):
 * ------------------------------------------------------------------
 * - This does NOT represent the real tax law of any country.
 * - Income is treated as a single annual number with no deductions,
 *   credits, filing status, or currency conversion.
 * - Tax is calculated progressively across four brackets, meaning each
 *   bracket's rate only applies to the portion of income that falls
 *   inside that bracket (not the whole income).
 *
 * BRACKETS (annual income, illustrative only):
 * ------------------------------------------------------------------
 *   $0      -  $10,000   : 0%
 *   $10,000 -  $40,000    : 10%
 *   $40,000 -  $85,000    : 20%
 *   $85,000 and above     : 30%
 *
 * Example: an income of $100,000 is taxed as:
 *   first $10,000  * 0%  = $0
 *   next  $30,000  * 10% = $3,000   (10,000 -> 40,000)
 *   next  $45,000  * 20% = $9,000   (40,000 -> 85,000)
 *   final $15,000  * 30% = $4,500   (85,000 -> 100,000)
 *   TOTAL                = $16,500
 */

const TAX_BRACKETS = [
  { upTo: 10000, rate: 0.0 },
  { upTo: 40000, rate: 0.10 },
  { upTo: 85000, rate: 0.20 },
  { upTo: Infinity, rate: 0.30 },
];

/**
 * Calculates progressive tax owed on a given annual income.
 *
 * @param {number} income - Non-negative annual income.
 * @returns {number} Tax owed, rounded to 2 decimal places.
 * @throws {Error} If income is not a finite number or is negative.
 */
function calculateTax(income) {
  if (typeof income !== 'number' || !Number.isFinite(income)) {
    throw new Error('Invalid income: must be a finite number');
  }
  if (income < 0) {
    throw new Error('Invalid income: cannot be negative');
  }

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of TAX_BRACKETS) {
    if (income <= previousLimit) {
      break;
    }
    const taxableInThisBracket = Math.min(income, bracket.upTo) - previousLimit;
    tax += taxableInThisBracket * bracket.rate;
    previousLimit = bracket.upTo;
  }

  // Avoid floating point artifacts like 3000.0000000000005
  return Math.round(tax * 100) / 100;
}

/**
 * Calculates the effective (average) tax rate for a given income.
 * Returns 0 for an income of 0 to avoid division by zero.
 *
 * @param {number} income
 * @returns {number} Effective tax rate as a fraction (e.g. 0.15 = 15%)
 */
function effectiveTaxRate(income) {
  const tax = calculateTax(income);
  if (income === 0) return 0;
  return Math.round((tax / income) * 10000) / 10000;
}

module.exports = {
  calculateTax,
  effectiveTaxRate,
  TAX_BRACKETS,
};
