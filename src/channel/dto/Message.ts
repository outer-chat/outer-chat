import * as swagger from '@nestjs/swagger';
import { Message as PrismaMessage } from '@prisma/client/edge';

export class Message extends Promise<Omit<PrismaMessage, 'channel' | 'author'>> {
    @swagger.ApiProperty({
        description: 'The message id',
        type: String,
        example: '37963246-7e9d-4239-a95f-96704c6dcbaa',
    })
    id: string;

    @swagger.ApiProperty({
        description: 'The message content',
        type: String,
        example: 'Hello world!',
    })
    content: string;

    @swagger.ApiProperty({
        description: 'The message createdAt',
        type: Date,
        example: new Date(),
    })
    createdAt: Date;

    @swagger.ApiProperty({
        description: 'The message updatedAt',
        type: Date,
        example: new Date(),
    })
    updatedAt: Date;
}
