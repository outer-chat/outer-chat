import * as swagger from '@nestjs/swagger';
import { PermissionOverwrite as PrismaPermissionOverwrite } from '@prisma/client/edge';

export class PermissionOverwrite extends Promise<Omit<PrismaPermissionOverwrite, 'channelId' | 'channel'>> {
    @swagger.ApiProperty({
        description: 'The permission overwrite id',
        type: String,
        example: '37963246-7e9d-4239-a95f-96704c6dcbaa',
    })
    id: string;

    @swagger.ApiProperty({
        description: 'The permission overwrite type',
        type: String,
        example: 'role',
    })
    type: string;

    @swagger.ApiProperty({
        description: 'The permission overwrite allow',
        type: Number,
        example: 0,
    })
    allow: number;

    @swagger.ApiProperty({
        description: 'The permission overwrite deny',
        type: Number,
        example: 0,
    })
    deny: number;
}
