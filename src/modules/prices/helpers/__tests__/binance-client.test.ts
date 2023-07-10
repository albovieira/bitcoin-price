import { jest, beforeEach, expect, describe, it } from '@jest/globals';

import * as request from '../../../../utils/request';
import { getPrice } from '../binance-client';

jest.mock('../../../../utils/request', () => ({
  get: jest.fn(),
}));

describe('getPrice', () => {
  const mockResponse = {
    symbol: 'BTCUSDT',
    bidPrice: '35000',
    bidQty: '0.5',
    askPrice: '35001',
    askQty: '0.8',
  };

  beforeEach(() => {
    (request.get as jest.Mock).mockResolvedValue(mockResponse as never);
  });

  it('should fetch and return the price data', async () => {
    const result = await getPrice();

    expect(result).toEqual(mockResponse);
    expect(request.get).toHaveBeenCalledWith(
      `${process.env.BINANCE_API_URL!}/api/v3/ticker/bookTicker?symbol=BTCUSDT`
    );
  });
});
