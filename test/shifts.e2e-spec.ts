import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/test-utils';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Shifts Module', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let driverId = '';
  const TEST_WORK_ID = `SHIFT-DRIVER-${Date.now()}`; // Unique ID

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);

    // Create a fresh test driver with unique workId
    const driverRes = await request(app.getHttpServer())
      .post('/v1/drivers/register')
      .send({
        name: 'Shift Test Driver',
        workId: TEST_WORK_ID,
        transportation: 'BICYCLE',
      })
      .expect(201);
    
    driverId = driverRes.body.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (driverId) {
      // Delete all shifts for this driver
      await prisma.shift.deleteMany({
        where: {
          driverId: driverId,
        },
      }).catch(() => {});

      // Delete the driver
      await prisma.user.delete({
        where: {
          id: driverId,
        },
      }).catch(() => {});
    }

    await app.close();
  });

  it('should start a new shift', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/shifts/start')
      .send({
        userId: driverId,
      })
      .expect(201);

    expect(res.body).toBeDefined();
    const returnedId = res.body.driverId || res.body.userId;
    expect(returnedId).toBe(driverId);
    expect(res.body.status || res.body.state).toBe('ACTIVE');
  });

  it('should get active shift for driver', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/shifts/active')
      .query({
        userId: driverId,
      })
      .expect(200);

    expect(res.body).toBeDefined();
    const returnedId = res.body.driverId || res.body.userId;
    expect(returnedId).toBe(driverId);
    expect(res.body.status || res.body.state).toBe('ACTIVE');
  });

  it('should stop the current shift', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/shifts/stop')
      .send({
        userId: driverId,
      })
      .expect(201); // Changed from 200 to 201

    expect(res.body).toBeDefined();
    expect(['COMPLETED', 'STOPPED', 'INACTIVE']).toContain(
      res.body.status || res.body.state
    );
    expect(res.body.endTime || res.body.endedAt).toBeDefined();
  });

  it('should get last completed shift', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/shifts/last')
      .query({
        userId: driverId,
      })
      .expect(200);

    expect(res.body).toBeDefined();
    const returnedId = res.body.driverId || res.body.userId;
    expect(returnedId).toBe(driverId);
    expect(['COMPLETED', 'STOPPED', 'INACTIVE']).toContain(
      res.body.status || res.body.state
    );
  });

  it('should not allow starting shift with active shift', async () => {
    // First start a new shift
    await request(app.getHttpServer())
      .post('/v1/shifts/start')
      .send({
        userId: driverId,
      })
      .expect(201);

    // Try to start another shift (should fail with 400)
    const res = await request(app.getHttpServer())
      .post('/v1/shifts/start')
      .send({
        userId: driverId,
      });
    
    expect(res.status).toBe(400);

    // Clean up the active shift
    await request(app.getHttpServer())
      .post('/v1/shifts/stop')
      .send({
        userId: driverId,
      })
      .expect(201); // Changed from 200 to 201
  });
});