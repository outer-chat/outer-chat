import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../services';
import { User } from '@prisma/client/edge';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  getUsers(): Promise<Omit<User, 'password'>[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.userService.getUser(id);
  }
}
