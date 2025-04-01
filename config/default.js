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
  auth: {
    secret: process.env.AUTH_SECRET,
    accessToken: {
      expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN,
    },
    idToken: {
      expiresIn: process.env.AUTH_ID_TOKEN_EXPIRES_IN,
    },
    refreshToken: {
      expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    },
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
    templatesFolder: 'templates/email',
  },
  queue: {
    host: process.env.QUEUE_HOST,
    port: process.env.QUEUE_PORT,
    password: process.env.QUEUE_PASSWORD,
  }
};
