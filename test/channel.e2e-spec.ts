import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { ChannelModule } from '../src/modules';
import { ChannelService } from '../src/services';
import { ChannelGuard } from '../src/guards/channel/channel.guard';

import { PrismaService } from '../src/prisma/prisma.service';
import { Channel, User } from '../src/dto';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ChannelType as PrismaChannelType,
  Channel as PrismaChannel,
  User as PrismaUser,
  ChannelRecipient as PrismaChannelRecipent
} from '@prisma/client/edge';

describe('ChannelController /channel routes', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
      providers: [ChannelService, PrismaService, ChannelGuard],
      exports: [PrismaService, ChannelGuard],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /channels', () => {
    it('should create a new channel', async () => {
      const mockUserAllowedInChannel = {
        id: '1',
        email: 'john@example.com',
        username: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
        friends: [],
        servers: [],
        channels: []
      };

      const mockChannel = {
        id: '1',
        name: 'general',
        type: PrismaChannelType.DM,
        nsfw: false,
        messages: [],
        recipients: [mockUserAllowedInChannel],
        createdAt: undefined,
        updatedAt: undefined,
        permissionOverwrites: []
      };

      jest.spyOn(prisma.channel, 'create').mockResolvedValue(mockChannel as any);

      const payload = { roles: ['USER'], userId: mockUserAllowedInChannel.id };
      const token = app.get<JwtService>(JwtService).sign(payload);

      const res = await request(app.getHttpServer())
        .post('/channels')
        .set('Authorization', `Bearer ${token}`)
        .send(mockChannel)
        .expect(201);

      expect(res.text).toEqual(`Channel with id ${mockChannel.id} has been created!`);
    });
  });

  describe('GET /channels', () => {
    it('should return all channels', async () => {
      const mockUserAllowedInChannel = {
        id: '1',
        email: 'john@example.com',
        username: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
        friends: [],
        servers: [],
        channels: []
      };

      const mockChannel = {
        id: '1',
        name: 'general',
        type: PrismaChannelType.DM,
        nsfw: false,
        messages: [],
        recipients: [],
        createdAt: undefined,
        updatedAt: undefined,
        permissionOverwrites: []
      };

      jest.spyOn(prisma.channel, 'findMany').mockResolvedValue([mockChannel] as any);

      const payload = { roles: ['ADMIN'], userId: mockUserAllowedInChannel.id };
      const token = app.get<JwtService>(JwtService).sign(payload);

      const res = await request(app.getHttpServer())
        .get('/channels')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toEqual([mockChannel]);
    });
  });

  describe('GET /channels/:id', () => {
    it('should return the prompted channel (must be a recipient)', async () => {
      const mockUserAllowedInChannel = {
        id: '1',
        email: 'john@example.com',
        username: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
        friends: [],
        servers: [],
        channels: ["1"]
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUserAllowedInChannel as any);

      const mockChannel = {
        id: '1',
        name: 'general',
        type: PrismaChannelType.DM,
        nsfw: false,
        messages: [],
        recipients: ["1"],
        permissionOverwrites: []
      };

      jest.spyOn(prisma.channel, 'findUnique').mockResolvedValue(mockChannel as any);

      const payload = { roles: ['USER'], userId: mockUserAllowedInChannel.id };
      const token = app.get<JwtService>(JwtService).sign(payload);

      const res = await request(app.getHttpServer())
        .get(`/channels/${mockChannel.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toEqual(mockChannel.id);
    });
  });

  describe('POST /channels/:id/recipients', () => {
    it('should add a recipient(s) to a channel', async () => {
      const mockUserAllowedInChannel = {
        id: '1',
        email: 'john@example.com',
        username: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
        friends: [],
        servers: [],
        channels: ["1"]
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUserAllowedInChannel as any);

      const mockChannel = {
        id: '1',
        name: 'general',
        type: PrismaChannelType.DM,
        nsfw: false,
        messages: [],
        recipients: ["1"],
        permissionOverwrites: []
      };

      jest.spyOn(prisma.channel, 'findUnique').mockResolvedValue(mockChannel as any);
      jest.spyOn(prisma.channel, 'update').mockResolvedValue(mockChannel as any);

      const payload = { roles: ['USER'], userId: mockUserAllowedInChannel.id };
      const token = app.get<JwtService>(JwtService).sign(payload);

      const res = await request(app.getHttpServer())
        .post(`/channels/${mockChannel.id}/recipients`)
        .set('Authorization', `Bearer ${token}`)
        .send({ recipients: ["2"] })
        .expect(201);

      expect(res.text).toEqual(`Recipient(s) with id(s) 2 have been added to channel with id ${mockChannel.id}!`);
    });
  });

  describe('DELETE /channels/:id/recipients', () => {
    it('should remove a recipient(s) from a channel', async () => {
      const mockUserAllowedInChannel = {
        id: '1',
        email: 'john@example.com',
        username: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
        friends: [],
        servers: [],
        channels: ["1"]
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUserAllowedInChannel as any);

      const mockChannel = {
        id: '1',
        name: 'general',
        type: PrismaChannelType.DM,
        nsfw: false,
        messages: [],
        recipients: ["1"],
        permissionOverwrites: []
      };

      jest.spyOn(prisma.channel, 'findUnique').mockResolvedValue(mockChannel as any);
      jest.spyOn(prisma.channel, 'update').mockResolvedValue(mockChannel as any);

      const payload = { roles: ['USER'], userId: mockUserAllowedInChannel.id };
      const token = app.get<JwtService>(JwtService).sign(payload);

      const res = await request(app.getHttpServer())
        .delete(`/channels/${mockChannel.id}/recipients`)
        .set('Authorization', `Bearer ${token}`)
        .send({ recipients: ["1"] })
        .expect(200);

      expect(res.text).toEqual(`Recipient(s) with id(s) 1 have been removed from channel with id ${mockChannel.id}!`);
    });
  });

  describe('PATCH /channels/:id', () => {
    it('should edit a channel', async () => {
      const mockUserAllowedInChannel = {
        id: '1',
        email: 'john@example.com',
        username: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
        friends: [],
        servers: [],
        channels: ["1"]
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUserAllowedInChannel as any);

      const mockChannel = {
        id: '1',
        name: 'general',
        type: PrismaChannelType.DM,
        nsfw: false,
        messages: [],
        recipients: ["1"],
        permissionOverwrites: []
      };

      jest.spyOn(prisma.channel, 'findUnique').mockResolvedValue(mockChannel as any);
      jest.spyOn(prisma.channel, 'update').mockResolvedValue(mockChannel as any);

      const payload = { roles: ['USER'], userId: mockUserAllowedInChannel.id };
      const token = app.get<JwtService>(JwtService).sign(payload);

      const res = await request(app.getHttpServer())
        .patch(`/channels/${mockChannel.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'general' })
        .expect(200);

      expect(res.text).toEqual(`Channel with id ${mockChannel.id} has been updated!`);
    });
  });

  describe('DELETE /channels/:id', () => {
    it('should delete a channel', async () => {
      const mockUserAllowedInChannel = {
        id: '1',
        email: 'john@example.com',
        username: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: Buffer.from(''),
        banner: Buffer.from(''),
        bannerColor: 'blue',
        bio: 'User bio',
        roles: ['USER'],
        friends: [],
        servers: [],
        channels: ["1"]
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUserAllowedInChannel as any);

      const mockChannel = {
        id: '1',
        name: 'general',
        type: PrismaChannelType.DM,
        nsfw: false,
        messages: [],
        recipients: ["1"],
        permissionOverwrites: []
      };

      jest.spyOn(prisma.channel, 'findUnique').mockResolvedValue(mockChannel as any);
      jest.spyOn(prisma.channel, 'delete').mockResolvedValue(mockChannel as any);

      const payload = { roles: ['USER'], userId: mockUserAllowedInChannel.id };
      const token = app.get<JwtService>(JwtService).sign(payload);

      const res = await request(app.getHttpServer())
        .delete(`/channels/${mockChannel.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.text).toEqual(`Channel with id ${mockChannel.id} has been deleted!`);
    });
  });
});
