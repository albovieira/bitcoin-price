import { jest, afterEach, expect, describe, it } from '@jest/globals';
import * as superagent from 'superagent';

import { wait } from '../functions';
import { get, post, request } from '../request';

jest.mock('superagent', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('../functions', () => ({
  wait: jest.fn(),
}));

describe('API tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should make a GET request and return the response body', async () => {
      const url = 'https://example.com';
      const responseBody = { message: 'Hello' };

      (superagent.get as any).mockResolvedValueOnce({ body: responseBody });

      const result = await get(url);

      expect(superagent.get).toHaveBeenCalledWith(url);
      expect(result).toEqual(responseBody);
    });

    it('should throw an error if the GET request fails', async () => {
      const url = 'https://example.com';
      const errorMessage = 'Failed to make GET request';

      (superagent.get as any).mockRejectedValueOnce(new Error(errorMessage));

      await expect(get(url)).rejects.toThrow(errorMessage);
      expect(superagent.get).toHaveBeenCalledWith(url);
    });
  });

  describe('post', () => {
    it('should make a POST request with data and return the response body', async () => {
      const url = 'https://example.com';
      const data = { name: 'Albo V' };
      const responseBody = { message: 'Success' };

      (superagent.post as any).mockReturnValueOnce({
        send: jest.fn().mockResolvedValueOnce({ body: responseBody } as never),
      });

      const result = await post(url, data);

      expect(superagent.post).toHaveBeenCalledWith(url);
      expect(result).toEqual(responseBody);
    });
  });

  describe('request', () => {
    it('should make a request using the specified method and return the response body', async () => {
      const url = 'https://example.com';
      const data = { name: 'Albo V' };
      const responseBody = { message: 'Success' };

      (superagent.get as any).mockResolvedValueOnce({ body: responseBody });

      const result = await request('get', url, data);

      expect(superagent.get).toHaveBeenCalledWith(url);
      expect(result).toEqual(responseBody);
    });

    it('should retry the request if it fails with a retryable error', async () => {
      const url = 'https://example.com';
      const data = { name: 'Albo V' };
      const errorMessage = 'Failed to make request';
      const maxTries = 3;

      (superagent.get as any)
        .mockRejectedValueOnce({ code: 'ECONNRESET' })
        .mockRejectedValueOnce({ code: 'ECONNRESET' })
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(request('get', url, data, maxTries)).rejects.toThrow(
        errorMessage
      );
      expect(superagent.get).toHaveBeenCalledTimes(maxTries);
      expect(wait).toHaveBeenCalledTimes(maxTries - 1);
    });

    it('should throw an error if the request fails with a non-retryable error', async () => {
      const url = 'https://example.com';
      const data = { name: 'Albo V' };
      const errorMessage = 'Failed to make request';
      const maxTries = 3;

      (superagent.get as any).mockRejectedValueOnce(new Error(errorMessage));

      await expect(request('get', url, data, maxTries)).rejects.toThrow(
        errorMessage
      );
      expect(superagent.get).toHaveBeenCalledTimes(1);
      expect(wait).not.toHaveBeenCalled();
    });
  });
});
