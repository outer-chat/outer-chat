import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';

import { AuthModule } from '../src/modules';
import { AuthService } from '../src/services';

import { PrismaService } from '../src/prisma/prisma.service';
import { User as PrismaUser } from '@prisma/client';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AuthController /auth routes', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

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
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should log in a user', async () => {
      const mockUser: PrismaUser = {
        id: '1',
        email: 'john@example.com',
        username: 'John_Doe',
        password: 'Password123?',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
      };

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(mockUser.password, salt);

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const mockUser: PrismaUser = {
        id: '1',
        email: 'john@example.com',
        username: 'John_Doe',
        password: 'Password123?',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: mockUser.email,
          username: mockUser.username,
          password: mockUser.password,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh a user token', async () => {
      const mockUser: PrismaUser = {
        id: '1',
        email: 'john@example.com',
        username: 'John_Doe',
        password: 'Password123?',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, 'update').mockResolvedValue(mockUser);

      jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: mockUser.id });


      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: jwtService.sign({ userId: mockUser.id }),
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });
  });
});
