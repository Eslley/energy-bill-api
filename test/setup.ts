import { Server } from './server';

export class TestServer extends Server {
  constructor() {
    super();
  }

  async init(): Promise<void> {
    super.setupExpress();
    super.setupDatabase();
    await super.setupControllers();
    await super.setupWorkers();
    await super.setupSchedulers();
  }
}

export const server = new TestServer();

beforeAll(async () => await server.init());
