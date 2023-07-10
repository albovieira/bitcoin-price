import express from 'express';

import { get } from './actions';

const priceRoutes = express.Router();

priceRoutes.get(
  '/bitcoin',
  async (
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const result = await get();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default priceRoutes;
