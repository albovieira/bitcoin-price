import { beforeEach, afterEach, expect, describe, it } from '@jest/globals';

import { addCommission } from '../add-commission';

describe('addComission', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env.SERVICE_COMMISSION = '0.01';
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it('should add the commission correctly to the price', () => {
    const price = 100;
    const expected = 100.01;

    const result = addCommission(price);

    expect(result).toBeCloseTo(expected, 8);
  });

  it('should add the commission correctly to the price with high precision', () => {
    const price = 30224.85000001;
    const expected = 30227.87248501;

    const result = addCommission(price);

    expect(result).toBeCloseTo(expected, 8);
  });

  it('should handle undefined commision correctly', () => {
    delete process.env.SERVICE_COMMISSION;
    const price = 1;
    const expected = 1;

    const result = addCommission(price);

    expect(result).toBe(expected);
  });

  it('should handle 0 commision correctly', () => {
    process.env.SERVICE_COMMISSION = '0';
    const price = 1;
    const expected = 1;

    const result = addCommission(price);

    expect(result).toBe(expected);
  });
});
