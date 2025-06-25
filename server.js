// API Server configuration

import express from 'express';
import indexRoutes from './routes/index';
import dbClient from './utils/db';
import HTTPError from './utils/httpErrors';
import redisClient from './utils/redis';

const api = express();
const port = process.env.PORT || 5000;

const checkApiAndDBHealth = async (req, res, next) => {
  if (!(await dbClient.isAliveWithTimeout(5000))) {
    return HTTPError.internalServerError(res);
  }

  if (!redisClient.isAlive()) {
    return HTTPError.internalServerError(res);
  }

  return next();
};

api.use(checkApiAndDBHealth);
api.use(express.json({ limit: '50mb' }));
api.use('/', indexRoutes);

api.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
