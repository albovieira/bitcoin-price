import * as superagent from 'superagent';

import { wait } from './functions';
import logger from './logger';

const get = async (url: string) => {
  const { body } = await superagent.get(url);
  return body;
};

const post = async (url: string, data: any) => {
  const { body } = await superagent.post(url).send(data);
  return body;
};

const request = async (
  type: 'get' | 'post',
  url: string,
  data: any,
  maxTries = 3,
  currentTry = 0
): Promise<any> => {
  try {
    const methods = {
      get,
      post,
    };
    const result = await methods[type](url, data);
    return result;
  } catch (error: any) {
    if (
      error.status === 500 ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNREFUSED'
    ) {
      if (currentTry <= maxTries) {
        const expBackoff = 2 ** currentTry;

        await wait(expBackoff);

        logger.warn(`Retrying request, current try: ${currentTry}`);
        return request(type, url, data, maxTries, currentTry + 1);
      }
      logger.error(`Max tries reached: ${error.message}`);
      throw new Error(`Max tries reached: ${error.message}}`);
    }
    throw error;
  }
};

export { get, post, request };
