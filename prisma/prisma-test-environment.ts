import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';
import dotenv from 'dotenv';
import { TestEnvironment } from 'jest-environment-node';
import { exec } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import { Client } from 'pg';
import type { Context } from 'vm';

dotenv.config({ path: '.env.test' });

const execSync = promisify(exec);

const prismaBinary = '.\\node_modules\\.bin\\prisma';

export default class PrismaTestEnvironment extends TestEnvironment {
  private schema: string;
  private connectionString: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    const dbHost = process.env.DATABASE_HOST;
    const dbPort = process.env.DATABASE_PORT;
    const dbName = process.env.DATABASE_NAME;
    const dbUser = process.env.DATABASE_USER;
    const dbPassword = process.env.DATABASE_PASSWORD;

    this.schema = `test_${randomUUID()}`;
    this.connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`;
  }

  async setup(): Promise<void> {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    await execSync(`${prismaBinary} migrate deploy`);

    return super.setup();
  }

  async teardown(): Promise<void> {
    const client = new Client({ connectionString: this.connectionString });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();

    return super.teardown();
  }

  getVmContext(): Context | null {
    return super.getVmContext();
  }
}
