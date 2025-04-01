require('dotenv').config();

module.exports = {
  app: {
    name: 'Base',
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    tz: process.env.TZ,
  },
  logger: {
    level: process.env.LOGGER_LEVEL,
    enabled: true,
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    exposedHeaders: ['Content-Disposition'],
  },
  helmet: {},
};
