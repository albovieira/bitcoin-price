const addCommission = (price: number): number => {
  const comissionPercent = Number(process.env.SERVICE_COMMISSION);
  if (!process.env.SERVICE_COMMISSION || comissionPercent <= 0) {
    return price;
  }
  const comission = comissionPercent / 100;
  return Number(price * (1 + comission));
};

export { addCommission };
