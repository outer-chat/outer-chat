import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { UserModule } from '../src/modules';
import { UserService } from '../src/services';
import { PrismaService } from '../src/prisma/prisma.service';

import { User as PrismaUser } from '@prisma/client/edge';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('UserController /user routes', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('SECRET'),
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [UserService, PrismaService],
      exports: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /user/all', () => {
    it('should return all users (logged in as an admin)', () => {
      const mockUsers: PrismaUser[] = [
        {
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
          roles: ['USER']
        },
        {
          id: '2',
          email: 'jane@example.com',
          username: 'Jane Smith',
          password: 'password',
          createdAt: new Date(),
          updatedAt: new Date(),
          avatar: Buffer.from(''),
          banner: Buffer.from(''),
          bannerColor: 'red',
          bio: 'User bio',
          roles: ['USER']
        },
      ];

      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(Promise.resolve(mockUsers) as any);

      const payload = { roles: ['ADMIN'] };
      const token = app.get<JwtService>(JwtService).sign(payload);

      return request(app.getHttpServer())
        .get('/user/all')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          const expectedUsers = mockUsers.map((user) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            avatar: { data: [], type: 'Buffer' },
            banner: { data: [], type: 'Buffer' },
          }));
          expect(res.body).toEqual(expectedUsers);
        });
    });

    it ('should return a 401 error on /user/all (not logged in)', () => {
      return request(app.getHttpServer())
        .get('/user/all')
        .expect(401);
    });

    it ('should return a 401 error on /user/all (wrong token)', () => {
      const payload = { roles: ['ADMIN'] };
      const token = app.get<JwtService>(JwtService).sign(payload);

      return request(app.getHttpServer())
        .get('/user/all')
        .set('Authorization', `Bearer ${token}wrong`)
        .expect(401);
    });

    it ('should return a 403 error on /user/all (logged in as an user)', () => {
      const payload = { roles: ['USER'] };
      const token = app.get<JwtService>(JwtService).sign(payload);

      return request(app.getHttpServer())
        .get('/user/all')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('GET /user/1', () => {
    it('should return a user (logged in as an user)', () => {
      const mockUsers: PrismaUser[] = [
        {
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
          roles: ['USER']
        },
        {
          id: '2',
          email: 'jane@example.com',
          username: 'Jane Smith',
          password: 'password',
          createdAt: new Date(),
          updatedAt: new Date(),
          avatar: Buffer.from(''),
          banner: Buffer.from(''),
          bannerColor: 'red',
          bio: 'User bio',
          roles: ['USER']
        },
      ];

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(Promise.resolve(mockUsers[0]) as any);

      const payload = { roles: ['USER']};
      const token = app.get<JwtService>(JwtService).sign(payload);

      return request(app.getHttpServer())
        .get('/user/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          const expectedUser = {
            ...mockUsers[0],
            createdAt: mockUsers[0].createdAt.toISOString(),
            updatedAt: mockUsers[0].updatedAt.toISOString(),
            avatar: { data: [], type: 'Buffer' },
            banner: { data: [], type: 'Buffer' },
          };
          expect(res.body).toEqual(expectedUser);
        });
    });

    it('should return a 401 error on /user/1 (not logged in)', () => {
      return request(app.getHttpServer())
        .get('/user/1')
        .expect(401);
    });

    it('should return a 401 error on /user/1 (wrong token)', () => {
      const payload = { roles: ['USER'] };
      const token = app.get<JwtService>(JwtService).sign(payload);

      return request(app.getHttpServer())
        .get('/user/1')
        .set('Authorization', `Bearer ${token}wrong`)
        .expect(401);
    });
  });

  describe('PATCH /user/1', () => {
    it('should patch a user (logged in as an admin)', () => {
      const mockedUser: PrismaUser = {
        id: '1',
        email: 'jane@example.com',
        username: 'Jane Doe',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER']
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(Promise.resolve(mockedUser) as any);
      jest.spyOn(prisma.user, 'update').mockResolvedValue(Promise.resolve(mockedUser) as any);

      const requestBody = { username: 'Jane_Smith' };

      const payload = { roles: ['ADMIN'] };
      const token = app.get<JwtService>(JwtService).sign(payload);

      return request(app.getHttpServer())
        .patch('/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(200)
        .expect("User updated successfully!");
    });

    it('should return a 401 error on /user/1 (logged as another user than the one being patched)', () => {
      const mockUser: PrismaUser = {
        id: '1',
        email: 'example@example.com',
        username: 'John Doe',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER']
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(Promise.resolve(mockUser) as any);

      const payload = { roles: ['USER'] };
      const token = app.get<JwtService>(JwtService).sign(payload);

      return request(app.getHttpServer())
        .patch('/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'Jane_Smith' })
        .expect(401);
    });

    it('should patch a user (logged as the user being patched)', () => {
      const mockUser: PrismaUser = {
        id: '1',
        email: 'example@example.com',
        username: 'John Doe',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER']
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(Promise.resolve(mockUser) as any);
      jest.spyOn(prisma.user, 'update').mockResolvedValue(Promise.resolve(mockUser) as any);

      const payload = { userId: '1', roles: ['USER'] };
      const token = app.get<JwtService>(JwtService).sign(payload);

      return request(app.getHttpServer())
        .patch('/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'Jane_Smith' })
        .expect(200)
        .expect("User updated successfully!");
    });
  });

  describe('DELETE /user/1', () => {
    it('should delete a user (logged in as an admin)', () => {
      const mockUser: PrismaUser = {
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
        roles: ['USER']
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(Promise.resolve(mockUser) as any);
      jest.spyOn(prisma.user, 'delete').mockResolvedValue(Promise.resolve(mockUser) as any);

      const payload = { roles: ['ADMIN'] };
      const token = app.get<JwtService>(JwtService).sign(payload);

      return request(app.getHttpServer())
        .delete('/user/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect("User deleted successfully!");
    });
  });
});
