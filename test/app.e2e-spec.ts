import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
// import { PrismaService } from 'src/common/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  // let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // prismaService = moduleFixture.get<PrismaService>(PrismaService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // check register, login, logout, get current user
  it('/api/users (POST) - register', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({
        username: 'test',
        password: 'test',
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
