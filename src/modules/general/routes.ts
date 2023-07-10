import express from 'express';

import healthcheck from './actions/healthcheck';
import testoutbound from './actions/test-outbound';

const generalRoutes = express.Router();

generalRoutes.get('/healthcheck', async (_, res) => {
  const result = await healthcheck();
  res.json(result);
});

generalRoutes.get('/test-outbound', async (_, res) => {
  const result = await testoutbound();
  res.json(result);
});

export default generalRoutes;
