import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    dotenv.config();

    let dbPath = '';

    if (process.env.DATABASE_URL) {
      dbPath = process.env.DATABASE_URL.replace(/^file:/, '');
    }

    if (!dbPath) {
      dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
    }

    const adapter = new PrismaBetterSqlite3({
      url: dbPath,
    });

    // ✅ super() MUST be called before using this
    super({
      adapter,
    });

    // Safe to use this.logger after super()
    this.logger.log(`SQLite Database: ${dbPath}`);

    if (fs.existsSync(dbPath)) {
      this.logger.log(
        `Database found (${fs.statSync(dbPath).size} bytes)`,
      );
    } else {
      this.logger.warn('Database file not found.');
    }
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected successfully.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected.');
  }
}