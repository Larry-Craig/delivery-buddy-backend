import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/test-utils';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Orders Module', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let orderId = '';

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    
    // Clean up test data before running
    await prisma.order.deleteMany({
      where: {
        pickupName: 'Lazzy Pizza',
      },
    }).catch(() => {});
  });

  afterAll(async () => {
    // Clean up after tests
    await prisma.order.deleteMany({
      where: {
        pickupName: 'Lazzy Pizza',
      },
    }).catch(() => {});

    await app.close();
  });

  it('should create a new order', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/orders')
      .send({
        pickupName: 'Lazzy Pizza',
        pickupAddress: '123 Pizza St.',
        destinationName: 'Mrs. Jonson',
        destinationAddress: '1142 Madison Ave, 2nd floor, app. 34',
        itemsJson: JSON.stringify([
          { name: 'Ham and Cheese Pizza 11 inch', price: 12, qty: 2 },
          { name: 'Pepperoni Pepper', price: 10, qty: 1 }
        ]),
        total: 34.00,
        tip: 5.00,
      })
      .expect(201);

    orderId = res.body.id;
    expect(orderId).toBeDefined();
    expect(res.body.pickupName).toBe('Lazzy Pizza');
  });

  it('should retrieve an order by ID', async () => {
    if (!orderId) {
      console.warn('Skipping test: Order was not created');
      return;
    }
    
    const res = await request(app.getHttpServer())
      .get(`/v1/orders/${orderId}`)
      .expect(200);

    expect(res.body.id).toBe(orderId);
    expect(res.body.pickupName).toBe('Lazzy Pizza');
    expect(res.body.destinationName).toBe('Mrs. Jonson');
  });

  it('should update order status', async () => {
    if (!orderId) {
      console.warn('Skipping test: Order was not created');
      return;
    }
    
    const res = await request(app.getHttpServer())
      .patch(`/v1/orders/${orderId}/status`)
      .send({
        status: 'DELIVERING' // Valid status from OrderStatus enum
      })
      .expect(200);

    expect(res.body.status).toBe('DELIVERING');
  });

  it('should send a support message', async () => {
    if (!orderId) {
      console.warn('Skipping test: Order was not created');
      return;
    }
    
    const res = await request(app.getHttpServer())
      .post(`/v1/orders/${orderId}/chat`)
      .send({
        sender: 'DRIVER', // Must be 'DRIVER' or 'SUPPORT'
        message: 'Hi, cannot reach the customer. Here for 15 mins already.'
      })
      .expect(201);

    expect(res.body.message).toBeDefined();
  });

  it('should retrieve chat history', async () => {
    if (!orderId) {
      console.warn('Skipping test: Order was not created');
      return;
    }
    
    const res = await request(app.getHttpServer())
      .get(`/v1/orders/${orderId}/chat`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 404 for unknown order', async () => {
    await request(app.getHttpServer())
      .get('/v1/orders/random-id')
      .expect(404);
  });
});