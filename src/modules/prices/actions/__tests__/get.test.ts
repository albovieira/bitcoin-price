/* eslint-disable no-extend-native */
import {
  jest,
  beforeEach,
  expect,
  describe,
  it,
  afterEach,
} from '@jest/globals';

import * as cache from '../../../../utils/database/cache';
import {
  addCommission,
  calculateMidPrice,
  getPrice as getBinancePrice,
} from '../../helpers';
import { get } from '../get';

jest.mock('../../../../utils/database/cache', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

jest.mock('../../helpers', () => ({
  addCommission: jest.fn(),
  calculateMidPrice: jest.fn(),
  getPrice: jest.fn(),
}));

describe('get', () => {
  const originalEnv = process.env;
  const mockPrice = {
    symbol: 'BTCUSDT',
    bidPrice: '35000',
    askPrice: '35001',
  };

  beforeEach(() => {
    process.env.SERVICE_COMMISSION = '0.01';
    jest.clearAllMocks();
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it('should fetch the price from cache if available', async () => {
    const cacheData = JSON.stringify(mockPrice);
    (cache.get as jest.Mock).mockResolvedValueOnce(cacheData as never);

    const result = await get();

    expect(cache.get).toHaveBeenCalledWith('price_BTC');
    expect(cache.set).not.toHaveBeenCalled();
    expect(result).toEqual(JSON.parse(cacheData));
  });

  it('should fetch the price from external API and calculate mid price if not in cache', async () => {
    (cache.get as jest.Mock).mockResolvedValueOnce(null as never);
    (getBinancePrice as jest.Mock).mockResolvedValueOnce(mockPrice as never);
    (addCommission as jest.Mock).mockImplementation((p) => Number(p) + 1);
    (calculateMidPrice as jest.Mock).mockReturnValueOnce(35001.5);

    Date.prototype.toISOString = jest.fn(() => '2023-07-10T00:00:00.000Z');

    const result = await get();

    expect(cache.get).toHaveBeenCalledWith('price_BTC');
    expect(getBinancePrice).toHaveBeenCalled();
    expect(addCommission).toHaveBeenCalledTimes(2);
    expect(calculateMidPrice).toHaveBeenCalledWith(35001, 35002);
    expect(cache.set).toHaveBeenCalled();
    expect(result).toEqual({
      ...mockPrice,
      symbol: 'BTC',
      bidPrice: '35001.00000000',
      askPrice: '35002.00000000',
      midPrice: '35001.50000000',
      lastUpdate: '2023-07-10T00:00:00.000Z',
    });
  });

  it('should throw an error if price data is not available in cache or API', async () => {
    (cache.get as jest.Mock).mockResolvedValueOnce(null as never);
    (getBinancePrice as jest.Mock).mockResolvedValueOnce(null as never);

    await expect(get()).rejects.toThrow(
      'Error getting price from external API'
    );

    expect(cache.get).toHaveBeenCalledWith('price_BTC');
    expect(getBinancePrice).toHaveBeenCalled();
    expect(addCommission).not.toHaveBeenCalled();
    expect(calculateMidPrice).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should throw an error if mid price cannot be calculated', async () => {
    (cache.get as jest.Mock).mockResolvedValueOnce(null as never);
    (getBinancePrice as jest.Mock).mockResolvedValueOnce(mockPrice as never);
    (addCommission as jest.Mock).mockReturnValueOnce(-1);
    (addCommission as jest.Mock).mockReturnValueOnce(+1);
    (calculateMidPrice as jest.Mock).mockReturnValueOnce(null);

    await expect(get()).rejects.toThrow('Can not calculate mid price');

    expect(cache.get).toHaveBeenCalledWith('price_BTC');
    expect(getBinancePrice).toHaveBeenCalled();
    expect(addCommission).toHaveBeenCalledTimes(2);
    expect(calculateMidPrice).toHaveBeenCalledWith(-1, +1);
    expect(cache.set).not.toHaveBeenCalled();
  });
});
