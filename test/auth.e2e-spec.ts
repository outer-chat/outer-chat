import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthModule } from '../src/modules';
import { AuthService } from '../src/services';

import { PrismaService } from '../src/prisma/prisma.service';
import { User as PrismaUser } from '@prisma/client';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AuthController /auth routes', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('SECRET'),
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [AuthService, PrismaService],
      exports: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get<AuthService>(AuthService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should log in a user', () => {
      const user: PrismaUser = {
        id: '1',
        email: 'john@example.com',
        username: 'John Doe',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
      };

      jest.spyOn(authService, 'loginUser').mockImplementation(async () => ({
        accessToken: {
          token: 'access-token',
          tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
        },
        refreshToken: {
          token: 'refresh-token',
          tokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        },
      }));

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(201);
    });
  });

  describe('POST /auth/register', () => {
    it('should register a user', () => {
      const user: PrismaUser = {
        id: '1',
        email: 'john@example.com',
        username: 'John Doe',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
      };

      jest.spyOn(authService, 'registerUser').mockImplementation(async () => ({
        accessToken: {
          token : 'access-token',
          tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
        },
        refreshToken: {
          token: 'refresh-token',
          tokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        },
      }));

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(201);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh a token', () => {
      const payload = { userId: '1', roles: ['USER'] };
      const token = app.get<JwtService>(JwtService).sign(payload);

      jest.spyOn(authService, 'refreshToken').mockImplementation(async () => ({
        accessToken: {
          token: 'access-token',
          tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
        },
        refreshToken: {
          token: 'refresh-token',
          tokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        },
      }));

      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    });
  });
});
