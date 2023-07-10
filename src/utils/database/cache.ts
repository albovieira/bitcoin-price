import getRedis from './redis';
import logger from '../logger';

const set = async (key: string, value: any, ttl?: number) => {
  try {
    if (ttl) {
      await getRedis().set(key, value, 'EX', ttl);
      return true;
    }
    await getRedis().set(key, value);
    return true;
  } catch (error) {
    logger.error(`Error setting data on redis: ${error}`);
    return false;
  }
};

const get = (key: string) => {
  try {
    return getRedis().get(key);
  } catch (error) {
    logger.error(`Error getting data on redis: ${error}`);
    return null;
  }
};

const del = async (key: string) => {
  try {
    await getRedis().del(key);
    return true;
  } catch (error) {
    logger.error(`Error deleting data on redis: ${error}`);
    return false;
  }
};

export { set, get, del };
