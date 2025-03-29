import express from 'express';
import { createServer } from 'http';
import { appEnv } from './utils/env.js';
import { logger } from './loaders/pino.js';
import errorHandler from './middlewares/error.js';
import routes from './routes/index.js';
import loaders from './loaders/index.js';

function main() {
  const app = express();
  const server = createServer(app);

  loaders(app);

  routes(app);

  errorHandler(app);

  server.listen(appEnv.PORT, () => {
    logger.info(`Server running on port ${appEnv.PORT}`);
  });
}

main();
