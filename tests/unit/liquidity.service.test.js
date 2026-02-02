import { calculateLiquidityScore } from '../../src/services/liquidity.service.js';

describe('Liquidity Score Service', () => {

  test('returns max score when liabilities are zero', () => {
    const result = calculateLiquidityScore(5000, 0);

    expect(result.liquidityScore).toBe(100);
    expect(result.status.label).toBe('Excellent');
  });

  test('calculates correct liquidity score', () => {
    const result = calculateLiquidityScore(2000, 1000);

    expect(result.currentRatio).toBeGreaterThan(1);
    expect(result.liquidityScore).toBeGreaterThan(60);
  });

  test('caps liquidity score at 100', () => {
    const result = calculateLiquidityScore(10000, 100);

    expect(result.liquidityScore).toBeLessThanOrEqual(100);
  });

});
