/**
 * math.utils.js
 * -----------------
 * Financial-safe mathematical utilities
 * Designed to NEVER return NaN or Infinity
 */

/**
 * Ensures a value is a valid finite number
 * Returns fallback otherwise
 */
export const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Clamps a number between min and max
 * Useful for scores and bounded metrics
 */
export const clamp = (value, min = 0, max = 100) => {
  const n = toNumber(value);
  return Math.max(min, Math.min(max, n));
};

/**
 * Safe division
 * - Prevents division by zero
 * - Prevents NaN / Infinity
 */
export const safeDivide = (numerator, denominator, fallback = 0) => {
  const num = toNumber(numerator);
  const den = toNumber(denominator);

  if (den === 0) return fallback;

  const result = num / den;
  return Number.isFinite(result) ? result : fallback;
};

/**
 * Sum of numeric array
 * Filters invalid values automatically
 */
export const sum = (arr = []) => {
  if (!Array.isArray(arr)) return 0;

  return arr.reduce(
    (total, val) => total + toNumber(val),
    0
  );
};

/**
 * Mean / Average of numeric array
 */
export const mean = (arr = []) => {
  if (!Array.isArray(arr) || arr.length === 0) return 0;

  return safeDivide(sum(arr), arr.length);
};

/**
 * Population standard deviation
 * Measures volatility / consistency
 */
export const stdDev = (arr = []) => {
  if (!Array.isArray(arr) || arr.length < 2) return 0;

  const avg = mean(arr);

  const variance =
    sum(arr.map(v => Math.pow(toNumber(v) - avg, 2))) / arr.length;

  return Math.sqrt(variance);
};

/**
 * Percentage change
 * Example: growth, decline
 */
export const percentageChange = (previous, current, fallback = 0) => {
  return safeDivide(
    toNumber(current) - toNumber(previous),
    Math.abs(toNumber(previous)),
    fallback
  ) * 100;
};

/**
 * Normalizes a value to 0–100 scale
 */
export const normalize = (value, min, max) => {
  if (max === min) return 0;

  return clamp(
    safeDivide(value - min, max - min) * 100
  );
};

/**
 * Runway calculation (months)
 * (cash + bank) / avg monthly burn
 */
export const runwayMonths = (
  cash,
  bankBalance,
  monthlyExpenses = []
) => {
  const availableCash =
    toNumber(cash) + toNumber(bankBalance);

  const avgBurn = mean(monthlyExpenses);

  return safeDivide(availableCash, avgBurn);
};
