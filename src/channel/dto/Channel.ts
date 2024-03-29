import * as swagger from '@nestjs/swagger';
import { Channel as PrismaChannel, ChannelType as PrismaChannelType } from '@prisma/client/edge';
import { User, Message, PermissionOverwrite } from '../../dto';

export class Channel extends Promise<PrismaChannel> {
    @swagger.ApiProperty({
        description: 'The channel id',
        type: String,
        example: '37963246-7e9d-4239-a95f-96704c6dcbaa',
    })
    id: string;

    @swagger.ApiProperty({
        description: 'The channel name',
        type: String,
        example: 'general',
    })
    name: string;

    @swagger.ApiProperty({
        description: 'The channel type',
        type: String,
        example: PrismaChannelType.DM,
    })
    type: PrismaChannelType;

    @swagger.ApiProperty({
        description: 'The channel topic',
        type: String,
        example: 'This is a general channel',
    })
    topic?: string;

    @swagger.ApiProperty({
        description: 'The channel nsfw',
        type: Boolean,
        example: false,
    })
    nsfw: boolean;

    @swagger.ApiProperty({
        description: 'The channel messages',
        type: [Message],
        example: [],
    })
    messages: Message[];

    @swagger.ApiProperty({
        description: 'The channel bitrate',
        type: Number,
        example: 64000,
    })
    bitrate?: number;

    @swagger.ApiProperty({
        description: 'The channel userLimit',
        type: Number,
        example: 10,
    })
    userLimit?: number;

    @swagger.ApiProperty({
        description: 'The channel rateLimitPerUser',
        type: Number,
        example: 10,
    })
    rateLimitPerUser?: number;

    @swagger.ApiProperty({
        description: 'The channel recipients',
        type: [User],
        example: [],
    })
    recipients: User[];

    @swagger.ApiProperty({
        description: 'The channel createdAt',
        type: Date,
        example: new Date(),
    })
    createdAt: Date;

    @swagger.ApiProperty({
        description: 'The channel updatedAt',
        type: Date,
        example: new Date(),
    })
    updatedAt: Date;

    @swagger.ApiProperty({
        description: 'The channel lastMessageId',
        type: String,
        example: '37963246-7e9d-4239-a95f-96704c6dcbaa',
    })
    lastMessageId?: string;

    @swagger.ApiProperty({
        description: 'The channel serverId',
        type: String,
        example: '37963246-7e9d-4239-a95f-96704c6dcbaa',
    })
    serverId?: string;

    @swagger.ApiProperty({
        description: 'The channel description',
        type: String,
        example: 'This is a general channel',
    })
    description?: string;

    @swagger.ApiProperty({
        description: 'The channel position',
        type: Number,
        example: 0,
    })
    position?: number;

    @swagger.ApiProperty({
        description: 'The channel permissionOverwrites',
        type: [PermissionOverwrite],
        example: [],
    })
    permissionOverwrites: PermissionOverwrite[];

    @swagger.ApiProperty({
        description: 'The channel ownerId',
        type: String,
        example: '37963246-7e9d-4239-a95f-96704c6dcbaa',
    })
    ownerId?: string;
}
