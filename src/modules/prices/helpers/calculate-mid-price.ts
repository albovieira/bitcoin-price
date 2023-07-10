const calculateMidPrice = (bidPrice: number, askPrice: number) => {
  const sum = bidPrice + askPrice;
  if (sum === 0) return null;

  return sum / 2;
};

export { calculateMidPrice };
