import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import { randomUUID } from 'crypto';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Wallet (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let testUser: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    await app.init();

    prisma = moduleFixture.get(PrismaService);

    testUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: 'Wallet Tester',
        workId: `WORK-${Date.now()}`,
        transportation: 'BICYCLE',
        walletBalance: 100,
        tipsBalance: 0,
      },
    });
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.transaction.deleteMany({
        where: {
          userId: testUser.id,
        },
      });

      await prisma.user.delete({
        where: {
          id: testUser.id,
        },
      });
    }

    await app.close();
  });

  describe('GET /wallet/rates', () => {
    it('should return exchange rates', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/wallet/rates')
        .expect(200);

      expect(response.body).toHaveProperty('source');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('BTC');
      expect(response.body.data).toHaveProperty('ETH');
      expect(response.body.data).toHaveProperty('RE');
    });
  });

  describe('POST /wallet/withdraw', () => {
    it('should reject invalid amount', async () => {
      await request(app.getHttpServer())
        .post('/v1/wallet/withdraw')
        .send({
          userId: testUser.id,
          amount: 'invalid',
        })
        .expect(400);
    });

    it('should reject insufficient funds', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/wallet/withdraw')
        .send({
          userId: testUser.id,
          amount: 500,
        })
        .expect(400);

      expect(JSON.stringify(response.body.message)).toContain(
        'Insufficient',
      );
    });

    it('should withdraw successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/wallet/withdraw')
        .send({
          userId: testUser.id,
          amount: 40,
        })
        .expect(201);

      expect(response.body.updatedUser.walletBalance).toBe(60);
      expect(response.body.transaction.amount).toBe(-40);
    });
  });

  describe('GET /wallet/transactions', () => {
    it('should return transaction history', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/wallet/transactions')
        .query({
          userId: testUser.id,
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});