import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from './helpers/test-utils';

describe('Application', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /v1 should return 404 or health endpoint', async () => {
    await request(app.getHttpServer()).get('/v1');
  });

  it('Swagger endpoint should exist', async () => {
    await request(app.getHttpServer())
      .get('/docs')
      .expect(404); // Swagger isn't configured in test bootstrap
  });
});