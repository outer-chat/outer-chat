import * as swagger from '@nestjs/swagger';
import { User as PrismaUser } from '@prisma/client/edge';

export class User extends Promise<Omit<PrismaUser, 'password' | 'serverId' | 'channelId' | 'Message' | 'Server' | 'Channel'>> {
  @swagger.ApiProperty({
    description: 'The user id',
    type: String,
    example: '37963246-7e9d-4239-a95f-96704c6dcbaa',
  })
  id: string;

  @swagger.ApiProperty({
    description: 'The user email',
    type: String,
    example: 'example@example.com',
  })
  email: string;

  @swagger.ApiProperty({
    description: 'The user username',
    type: String,
    example: 'my_super_username',
  })
  username: string;

  @swagger.ApiProperty({
    description: 'The user createdAt',
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @swagger.ApiProperty({
    description: 'The user updatedAt',
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @swagger.ApiProperty({
    description: 'The user avatar',
    type: Buffer,
    example: 'Byte array',
  })
  avatar: Buffer;

  @swagger.ApiProperty({
    description: 'The user banner',
    type: Buffer,
    example: 'Byte array',
  })
  banner: Buffer;

  @swagger.ApiProperty({
    description: 'The user banner color',
    type: String,
    example: '#ffffff',
  })
  bannerColor: string;

  @swagger.ApiProperty({
    description: 'The user bio',
    type: String,
    example: 'I am a software developer',
  })
  bio: string;
  roles: any;
}
