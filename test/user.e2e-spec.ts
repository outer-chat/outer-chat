import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { UserModule } from '../src/modules';
import { UserService } from '../src/services';
import { PrismaModule } from '../src/prisma/prisma.module';

import { User as PrismaUser } from '@prisma/client/edge';
import { User } from 'src/dto';

describe('UserController /user routes', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule, PrismaModule],
      providers: [UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return all users', () => {
    const mockUsers: PrismaUser[] = [
      {
        id: '1',
        email: 'john@example.com',
        username: 'John Doe',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: new Buffer(''),
        banner: new Buffer(''),
        bannerColor: 'blue',
        bio: 'User bio',
        serverId: 'server1',
        channelId: 'channel1'
      },
      {
        id: '2',
        email: 'jane@example.com',
        username: 'Jane Smith',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: new Buffer(''),
        banner: new Buffer(''),
        bannerColor: 'red',
        bio: 'User bio',
        serverId: 'server2',
        channelId: 'channel2'
      },
    ];

    jest.spyOn(userService, 'getAllUsers').mockResolvedValue(mockUsers as unknown as User[]);

    return request(app.getHttpServer())
      .get('/user/all')
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

  it('should return a user', () => {
    const mockUsers: PrismaUser[] = [
      {
        id: '1',
        email: 'john@example.com',
        username: 'John Doe',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: new Buffer(''),
        banner: new Buffer(''),
        bannerColor: 'blue',
        bio: 'User bio',
        serverId: 'server1',
        channelId: 'channel1'
      },
      {
        id: '2',
        email: 'jane@example.com',
        username: 'Jane Smith',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: new Buffer(''),
        banner: new Buffer(''),
        bannerColor: 'red',
        bio: 'User bio',
        serverId: 'server2',
        channelId: 'channel2'
      },
    ];

    jest.spyOn(userService, 'getUser').mockResolvedValue(mockUsers[0] as unknown as User);

    return request(app.getHttpServer())
      .get('/user/1')
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
});
