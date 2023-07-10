const wait = (seconds: number) => {
  const ms = seconds * 1000;
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export { wait };
