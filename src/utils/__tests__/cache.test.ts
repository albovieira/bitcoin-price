import { jest, afterEach, expect, describe, it } from '@jest/globals';

import * as cache from '../database/cache';
import getRedis from '../database/redis';

jest.mock('../database/redis', () => jest.fn());

describe('set', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set a value without TTL', async () => {
    const key = 'myKey';
    const value = 'myValue';

    const redisMock = {
      set: jest.fn().mockResolvedValue(true as never),
    };

    (getRedis as any).mockReturnValue(redisMock);

    const result = await cache.set(key, value);

    expect(getRedis).toHaveBeenCalledTimes(1);
    expect(redisMock.set).toHaveBeenCalledTimes(1);
    expect(redisMock.set).toHaveBeenCalledWith(key, value);
    expect(result).toBe(true);
  });

  it('should set a value with TTL', async () => {
    const key = 'myKey';
    const value = 'myValue';
    const ttl = 3600;

    const redisMock = {
      set: jest.fn().mockResolvedValue(true as never),
    };

    (getRedis as any).mockReturnValue(redisMock);

    const result = await cache.set(key, value, ttl);

    expect(getRedis).toHaveBeenCalledTimes(1);
    expect(redisMock.set).toHaveBeenCalledTimes(1);
    expect(redisMock.set).toHaveBeenCalledWith(key, value, 'EX', ttl);
    expect(result).toBe(true);
  });

  it('should handle errors when setting a value', async () => {
    const key = 'myKey';
    const value = 'myValue';

    const redisMock = {
      set: jest.fn().mockRejectedValue(new Error('Redis error') as never),
    };

    (getRedis as any).mockReturnValue(redisMock);

    const result = await cache.set(key, value);

    expect(getRedis).toHaveBeenCalledTimes(1);
    expect(redisMock.set).toHaveBeenCalledTimes(1);
    expect(redisMock.set).toHaveBeenCalledWith(key, value);
    expect(result).toBe(false);
  });
});

describe('get', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get a value from Redis', async () => {
    const key = 'myKey';
    const value = 'myValue';

    const redisMock = {
      get: jest.fn().mockResolvedValue(value as never),
    };

    (getRedis as any).mockReturnValue(redisMock);

    const result = await cache.get(key);

    expect(getRedis).toHaveBeenCalledTimes(1);
    expect(redisMock.get).toHaveBeenCalledTimes(1);
    expect(redisMock.get).toHaveBeenCalledWith(key);
    expect(result).toBe(value);
  });

  it('should handle errors when getting a value', async () => {
    const key = 'myKey';

    const redisMock = {
      get: jest.fn().mockImplementation(() => {
        throw new Error('Redis error');
      }),
    };

    (getRedis as any).mockReturnValue(redisMock);

    const result = await cache.get(key);

    expect(getRedis).toHaveBeenCalledTimes(1);
    expect(redisMock.get).toHaveBeenCalledTimes(1);
    expect(redisMock.get).toHaveBeenCalledWith(key);
    expect(result).toBeNull();
  });
});

describe('del', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a value from Redis', async () => {
    const key = 'myKey';

    const redisMock = {
      del: jest.fn().mockResolvedValue(1 as never),
    };

    (getRedis as any).mockReturnValue(redisMock);

    const result = await cache.del(key);

    expect(getRedis).toHaveBeenCalledTimes(1);
    expect(redisMock.del).toHaveBeenCalledTimes(1);
    expect(redisMock.del).toHaveBeenCalledWith(key);
    expect(result).toBe(true);
  });

  it('should handle errors when deleting a value', async () => {
    const key = 'myKey';

    const redisMock = {
      del: jest.fn().mockRejectedValue(new Error('Redis error') as never),
    };

    (getRedis as any).mockReturnValue(redisMock);

    const result = await cache.del(key);

    expect(getRedis).toHaveBeenCalledTimes(1);
    expect(redisMock.del).toHaveBeenCalledTimes(1);
    expect(redisMock.del).toHaveBeenCalledWith(key);
    expect(result).toBe(false);
  });
});
