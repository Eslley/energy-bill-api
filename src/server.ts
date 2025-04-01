import { Server as OvernightServer } from '@overnightjs/core';
import bodyParser from 'body-parser';
import config from 'config';
import cors, { CorsOptions } from 'cors';
import helmet, { HelmetOptions } from 'helmet';
import glob from 'tiny-glob';
import * as express from 'express';

import { DatabaseModule, PrismaDatabaseModule } from '@modules/database';
import logger from '@modules/logger';
import { HttpServerModule, ServerModule } from '@modules/server';
import { routeNotFound } from '@utils/http';

export class Server extends OvernightServer {
  private server: ServerModule;
  private database: DatabaseModule;

  constructor() {
    super();
  }

  protected setupExpress(): void {
    const corsOptions: CorsOptions = config.get('cors');
    const helmetOptions: HelmetOptions = config.get('helmet');

    this.app.use(cors(corsOptions));
    this.app.use(helmet(helmetOptions));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use('/upload', express.static(config.get('storage.path')));

    logger.info(corsOptions, 'Cors');
    logger.info(helmetOptions, 'Helmet');
  }

  protected setupDatabase(): void {
    this.database = new PrismaDatabaseModule();
  }

  protected async setupControllers(): Promise<void> {
    const files = await glob(`${__dirname}/use-cases/**/controller.[t|j]s`, {
      absolute: true,
    });

    const controllers = await Promise.all(
      files.map(async (file) => {
        const module = await import(file);
        return module[Object.keys(module)[0]];
      })
    );

    super.addControllers(controllers.map((Controller) => new Controller()));
    this.app.use(routeNotFound);

    logger.info(
      controllers.map((Controller) => Controller.name),
      'Controllers'
    );
  }

  protected async setupWorkers(): Promise<void> {
    const files = await glob(`${__dirname}/use-cases/**/worker.[t|j]s`, {
      absolute: true,
    });

    const workers = await Promise.all(
      files.map(async (file) => {
        const module = await import(file);
        return module[Object.keys(module)[0]];
      })
    );

    workers.forEach((Worker) => new Worker());

    logger.info(
      workers.map((Worker) => Worker.name),
      'Workers'
    );
  }

  protected async setupSchedulers(): Promise<void> {
    const files = await glob(`${__dirname}/use-cases/**/scheduler.[t|j]s`, {
      absolute: true,
    });

    const schedulers = await Promise.all(
      files.map(async (file) => {
        const module = await import(file);
        return module[Object.keys(module)[0]];
      })
    );

    schedulers.forEach((Scheduler) => new Scheduler());

    logger.info(
      schedulers.map((Scheduler) => Scheduler.name),
      'Schedulers'
    );
  }

  async start(port = 3000): Promise<void> {
    this.setupExpress();
    this.setupDatabase();
    await this.setupControllers();
    await this.setupWorkers();
    await this.setupSchedulers();

    const server = this.app.listen(port, () => {
      const env: string = config.get('app.env');
      const tz: string = config.get('app.tz');

      logger.info(env, 'Environment');
      logger.info(port, 'Port');
      logger.info(tz, 'Timezone');
      logger.info('Server started');
    });

    this.server = new HttpServerModule(server);
    this.server.handleConnections();
    await this.database.connect();

    process.on('SIGINT', async () => await this.stop());
    process.on('SIGTERM', async () => await this.stop());
  }

  async stop(): Promise<void> {
    await this.database.disconnect();
    this.server.handleDisconnects();

    logger.info('Server stopped');
  }
}
