import { logger, cache } from '../../../utils';
import {
  addCommission,
  calculateMidPrice,
  getPrice as getBinancePrice,
} from '../helpers';

const get = async () => {
  logger.info(`Getting bitcoin price...`);
  const inCache = await cache.get(`price_BTC`);
  if (inCache) {
    const inCacheData = JSON.parse(inCache);
    logger.info(`Getting bitcoin price from cache...`);
    return inCacheData;
  }

  logger.info(`Getting from external API...`);
  const result = await getBinancePrice();

  if (!result) throw new Error('Error getting price from external API');

  logger.info(`Adding Commission...`);
  const [bidPrice, askPrice] = [result.bidPrice, result.askPrice].map((p) =>
    addCommission(Number(p))
  );

  if (!bidPrice || !askPrice) throw new Error('No price data');

  logger.info(`Calculating mid price...`);
  const midPrice = calculateMidPrice(bidPrice, askPrice);

  if (!midPrice) throw new Error('Can not calculate mid price');

  const parsedResult = {
    ...result,
    symbol: 'BTC',
    bidPrice: bidPrice.toFixed(8),
    askPrice: askPrice.toFixed(8),
    midPrice: midPrice.toFixed(8),
    lastUpdate: new Date().toISOString(),
  };

  logger.info(
    `Saving in cache for ${process.env.PRICE_UPDATE_FREQUENCY_IN_SECONDS} seconds`
  );
  await cache.set(
    'price_BTC',
    JSON.stringify(parsedResult),
    Number(process.env.PRICE_UPDATE_FREQUENCY_IN_SECONDS!)
  );

  return parsedResult;
};

export { get };
