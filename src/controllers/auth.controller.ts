import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { User } from '@prisma/client/edge';
import { AuthService } from 'src/services/auth.service';
import { Tokens } from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() user: User): Promise<Tokens> {
    return this.authService.registerUser(user);
  }

  @Post('refresh')
  refreshToken(@Body() refreshToken: string): Promise<Tokens> {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('login')
  loginUser(@Body() user: User): Promise<Tokens> {
    return this.authService.loginUser(user);
  }
}
