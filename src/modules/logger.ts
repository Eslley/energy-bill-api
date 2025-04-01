import config from 'config';
import pino from 'pino';

export default pino({
  enabled: config.get('logger.enabled'),
  level: config.get('logger.level'),
});
