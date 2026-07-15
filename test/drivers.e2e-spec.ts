import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/test-utils';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Drivers Module', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let driverId = '';

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    
    // Clean up any existing test data before running tests
    await prisma.user.deleteMany({
      where: {
        workId: 'TEST1001',
      },
    }).catch(() => {
      // Ignore if no records exist
    });
  });

  afterAll(async () => {
    // Clean up test data after all tests
    if (driverId) {
      await prisma.user.delete({
        where: {
          id: driverId,
        },
      }).catch(() => {
        // Ignore if record doesn't exist
      });
    }

    // Also clean up by workId in case driverId wasn't captured
    await prisma.user.deleteMany({
      where: {
        workId: 'TEST1001',
      },
    }).catch(() => {
      // Ignore if no records exist
    });

    await app.close();
  });

  it('should register a driver', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/drivers/register')
      .send({
        name: 'John Driver',
        workId: 'TEST1001',
        transportation: 'BICYCLE',
      })
      .expect(201);

    driverId = res.body.id;

    expect(driverId).toBeDefined();
  });

  it('should reject duplicate work ID', async () => {
    await request(app.getHttpServer())
      .post('/v1/drivers/register')
      .send({
        name: 'John Driver',
        workId: 'TEST1001',
        transportation: 'BICYCLE',
      })
      .expect(409);
  });

  it('should login using work ID', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/drivers/login')
      .query({
        workId: 'TEST1001',
      })
      .expect(200);

    expect(res.body.workId).toBe('TEST1001');
  });

  it('should retrieve profile', async () => {
    const res = await request(app.getHttpServer())
      .get(`/v1/drivers/${driverId}`)
      .expect(200);

    expect(res.body.id).toBe(driverId);
  });

  it('should return 404 for unknown driver', async () => {
    await request(app.getHttpServer())
      .get('/v1/drivers/random-id')
      .expect(404);
  });
});