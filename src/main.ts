import config from 'config';

import { Server } from './server';

async function bootstrap(): Promise<void> {
  const port: number = config.get('app.port');

  const server = new Server();
  await server.start(port);
}

bootstrap();
