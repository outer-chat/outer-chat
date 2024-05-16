import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { ChannelModule } from '../src/modules';
import { ChannelService } from '../src/services';

import { PrismaService } from '../src/prisma/prisma.service';
import { Channel, User } from '../src/dto';
import { ChannelType as PrismaChannelType, Channel as PrismaChannel } from '@prisma/client/edge';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { $Enums, User as PrismaUser } from '@prisma/client';

describe('ChannelController /channel routes', () => {
  let app: INestApplication;
  let channelService: ChannelService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ChannelModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('SECRET'),
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [ChannelService, PrismaService],
      exports: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    channelService = moduleFixture.get<ChannelService>(ChannelService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /channels', () => {
    it('should create a new channel', async () => {
      const mockChannel: Channel = {
        id: '1',
        name: 'general',
        type: PrismaChannelType.DM,
        nsfw: false,
        messages: [],
        recipients: [],
        createdAt: undefined,
        updatedAt: undefined,
        permissionOverwrites: [],
        then: function <TResult1 = { id: string; name: string; type: $Enums.ChannelType; topic: string; nsfw: boolean; bitrate: number; userLimit: number; rateLimitPerUser: number; createdAt: Date; updatedAt: Date; lastMessageId: string; serverId: string; description: string; position: number; ownerId: string; }, TResult2 = never>(onfulfilled?: (value: { id: string; name: string; type: $Enums.ChannelType; topic: string; nsfw: boolean; bitrate: number; userLimit: number; rateLimitPerUser: number; createdAt: Date; updatedAt: Date; lastMessageId: string; serverId: string; description: string; position: number; ownerId: string; }) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2> {
          throw new Error('Function not implemented.');
        },
        catch: function <TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<{ id: string; name: string; type: $Enums.ChannelType; topic: string; nsfw: boolean; bitrate: number; userLimit: number; rateLimitPerUser: number; createdAt: Date; updatedAt: Date; lastMessageId: string; serverId: string; description: string; position: number; ownerId: string; } | TResult> {
          throw new Error('Function not implemented.');
        },
        finally: function (onfinally?: () => void): Promise<{ id: string; name: string; type: $Enums.ChannelType; topic: string; nsfw: boolean; bitrate: number; userLimit: number; rateLimitPerUser: number; createdAt: Date; updatedAt: Date; lastMessageId: string; serverId: string; description: string; position: number; ownerId: string; }> {
          throw new Error('Function not implemented.');
        },
        [Symbol.toStringTag]: ''
      };

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

      jest.spyOn(channelService, 'createChannel').mockResolvedValue(Promise.resolve("Channel created!"));

      const payload = { roles: ['USER'] };
      const jwtService = app.get(JwtService);
      const token = jwtService.sign(payload);

      await request(app.getHttpServer())
        .post('/channels')
        .set('Authorization', `Bearer ${token}`)
        .send(mockChannel)
        .expect(201)
        .expect('Channel created!');
    });
  });

  describe('GET /channels', () => {
    it('should return all channels', async () => {
      const mockChannel: Channel = {
        id: '1',
        name: 'general',
        type: PrismaChannelType.DM,
        nsfw: false,
        messages: [],
        recipients: [],
        createdAt: undefined,
        updatedAt: undefined,
        permissionOverwrites: [],
        then: function <TResult1 = { id: string; name: string; type: $Enums.ChannelType; topic: string; nsfw: boolean; bitrate: number; userLimit: number; rateLimitPerUser: number; createdAt: Date; updatedAt: Date; lastMessageId: string; serverId: string; description: string; position: number; ownerId: string; }, TResult2 = never>(onfulfilled?: (value: { id: string; name: string; type: $Enums.ChannelType; topic: string; nsfw: boolean; bitrate: number; userLimit: number; rateLimitPerUser: number; createdAt: Date; updatedAt: Date; lastMessageId: string; serverId: string; description: string; position: number; ownerId: string; }) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2> {
          throw new Error('Function not implemented.');
        },
        catch: function <TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<{ id: string; name: string; type: $Enums.ChannelType; topic: string; nsfw: boolean; bitrate: number; userLimit: number; rateLimitPerUser: number; createdAt: Date; updatedAt: Date; lastMessageId: string; serverId: string; description: string; position: number; ownerId: string; } | TResult> {
          throw new Error('Function not implemented.');
        },
        finally: function (onfinally?: () => void): Promise<{ id: string; name: string; type: $Enums.ChannelType; topic: string; nsfw: boolean; bitrate: number; userLimit: number; rateLimitPerUser: number; createdAt: Date; updatedAt: Date; lastMessageId: string; serverId: string; description: string; position: number; ownerId: string; }> {
          throw new Error('Function not implemented.');
        },
        [Symbol.toStringTag]: ''
      };

      jest.spyOn(channelService, 'getChannels').mockResolvedValue(Promise.resolve([mockChannel]));

      const payload = { roles: ['ADMIN'] };
      const jwtService = app.get(JwtService);
      const token = jwtService.sign(payload);

      await request(app.getHttpServer())
        .get('/channels')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body[0].id).toBe('1');
          expect(res.body[0].name).toBe('general');
          expect(res.body[0].type).toBe('DM');
          expect(res.body[0].nsfw).toBe(false);
        });
    });
  });
});
