import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client/edge';
import { Token, User } from '../dto';
import * as swagger from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Tokens } from '../dto';

@swagger.ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @swagger.ApiOkResponse({
    status: 201,
    description: 'Register the prompted user',
    type: Tokens,
  })
  @swagger.ApiBody({
    type: User,
    examples: {
      registerUserBody: {
        value: {
          email: 'example@example.com',
          username: 'my_super_username',
          password: 'my_super_password',
        },
        description: 'Must contain email, username and password fields to register a user',
      },
    },
  })
  @Post('register')
  registerUser(@Body() user: PrismaUser): Promise<Tokens> {
    return this.authService.registerUser(user);
  }

  @swagger.ApiOkResponse({
    status: 200,
    description: 'Login the prompted user',
    type: Tokens,
  })
  @swagger.ApiBody({
    type: User,
    examples: {
      loginUserBodyOnlyUsername: {
        value: {
          username: 'my_super_username',
          password: 'my_super_password',
        },
        description: 'If you want to login with username, you must provide username and password fields',
      },
      loginUserBodyOnlyEmail: {
        value: {
          email: 'example@example.com',
          password: 'my_super_password',
        },
        description: 'If you want to login with email, you must provide email and password fields',
      },
      loginUserBodyEmailUsernameAndPassword: {
        value: {
          email: 'example@example.com',
          username: 'my_super_username',
          password: 'my_super_password',
        },
        description: 'If you want to login with email and username, you must provide email, username and password fields',
      },
    },
  })
  @Post('login')
  loginUser(@Body() user: PrismaUser): Promise<Tokens> {
    return this.authService.loginUser(user);
  }

  @swagger.ApiOkResponse({
    status: 200,
    description: 'The new access tokens and their expiration dates',
    type: Tokens,
  })
  @swagger.ApiBody({
    type: Token,
    examples: {
      refreshTokenBody: {
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ',
        description: 'Must contain the refresh token',
      },
    },
  })
  @Post('refresh')
  refreshToken(@Body() body: JSON): Promise<Tokens> {
    const refreshToken = body['refreshToken'];

    return this.authService.refreshToken(refreshToken);
  }
}
