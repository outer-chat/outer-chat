import * as swagger from '@nestjs/swagger';

export class Token {
    @swagger.ApiProperty({
        type: String,
        description: 'Token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ',
    })
    token: string;
    @swagger.ApiProperty({
        type: Date,
        description: 'Token expiration date',
        example: '2021-01-01T00:00:00.000Z',
    })
    tokenExpiresAt: Date;
}

export class Tokens {
    @swagger.ApiProperty({
        type: Token,
        description: 'Access token',
    })
    accessToken: Token;
    @swagger.ApiProperty({
        type: Token,
        description: 'Refresh token',
    })
    refreshToken: Token;
}
