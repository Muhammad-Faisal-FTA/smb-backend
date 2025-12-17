export const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

export const safeDivide = (num, den, fallback = 0) =>
  // Changed to allow negative numbers, but prevent division by zero
  den !== 0 ? num / den : fallback;

export const mean = (arr) =>
  // FIX: removed () from arr.length
  arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

export const stdDev = (arr) => {
  if (arr.length < 2) return 0;
  
  const avg = mean(arr);
  
  const variance =
    arr.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / arr.length;
    
  return Math.sqrt(variance);
};