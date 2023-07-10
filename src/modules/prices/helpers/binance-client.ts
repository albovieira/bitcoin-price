import { request } from '../../../utils';

const getPrice = async (): Promise<{
  symbol: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
}> => {
  const result = await request.get(
    `${process.env.BINANCE_API_URL!}/api/v3/ticker/bookTicker?symbol=BTCUSDT`
  );
  return result;
};

export { getPrice };
