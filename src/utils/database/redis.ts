import Redis from 'ioredis';

let redis: Redis | null = null;
const getRedis = () => {
  if (redis) return redis;
  redis = new Redis(process.env.REDIS_URL!);
  return redis;
};

export default getRedis;
