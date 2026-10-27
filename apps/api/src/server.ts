import { createApp } from './app';
import { env } from './config/env';
import { logger } from './common/logging/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 FieldOps API server running at http://localhost:${env.PORT}`);
  logger.info(`📌 Health check available at http://localhost:${env.PORT}/health`);
  logger.info(`📌 API endpoints mounted under ${env.API_PREFIX}`);
});

function handleShutdown(signal: string) {
  logger.info(`Received ${signal}. Gracefully shutting down FieldOps server...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

