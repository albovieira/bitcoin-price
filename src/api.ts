/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable import/first */
if (process.env.NODE_ENV === 'local') {
  require('dotenv').config({ path: './.env.local' });
} else {
  require('dotenv').config({ path: './.env' });
}

import 'reflect-metadata';

import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

import { errorMiddleware } from './middlewares';
import generalRouter from './modules/general/routes';
import pricesRouter from './modules/prices/routes';
import { logger } from './utils';

const api = express();
const bodyParser = require('body-parser');

api.use(json({ limit: '50mb' }));
api.use(cors());

api.use(bodyParser.urlencoded({ extended: true }));

/** Request Log */
api.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${res.statusCode}`);
  next();
});

api.use(
  helmet({
    contentSecurityPolicy: false,
  }) as any
);
const router = express.Router();

/** Add swagger */
const swaggerDocument = yaml.load(`${__dirname}/../docs/swagger.yaml`);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/** Routes config */
router.use('/', generalRouter);
router.use('/prices', pricesRouter);
api.use('/', router);
api.use('/v1', router);

/** Not found error handler */
api.use((_, res, _2) => res.status(404).json({ error: 'NOT FOUND' }));

/**
 * Middleware Error
 */
api.use(errorMiddleware);

/** Starts API */
const PORT = process.env.PORT || 3001;
const server = api.listen(PORT, async () => {
  logger.info(`Listening on port ${PORT}`);
});

/** Gracefull shutdown */
const gracefulShutdown = () => {
  logger.warn('Received shutdown signal, closing server...');

  server.close((err) => {
    if (err) {
      logger.error('Error occurred while closing the server:', err);
      process.exit(1);
    }

    logger.warn('Server closed, exiting process...');
    process.exit(0);
  });
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
