import { expect, describe, it } from '@jest/globals';

import { calculateMidPrice } from '../calculate-mid-price';

describe('calculateMidPrice', () => {
  it('should calculate the correct mid price', () => {
    const bidPrice = 10;
    const askPrice = 20;
    const expected = 15;

    const result = calculateMidPrice(bidPrice, askPrice);

    expect(result).toBe(expected);
  });

  it('should calculate the correct mid price when bid and ask prices have decimal values', () => {
    const bidPrice = 10.5;
    const askPrice = 20.25;
    const expected = 15.375;

    const result = calculateMidPrice(bidPrice, askPrice);

    expect(result).toBe(expected);
  });

  it('should return 0 if can not calculate mid price', () => {
    const bidPrice = 0;
    const askPrice = 0;
    const expected = null;

    const result = calculateMidPrice(bidPrice, askPrice);

    expect(result).toBe(expected);
  });
});
