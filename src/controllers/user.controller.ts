import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../services';
import * as swagger from '@nestjs/swagger';
import { User } from '../dto';

@swagger.ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @swagger.ApiOkResponse({
    status: 200,
    description: 'Returns all users',
    type: [User],
  })
  @Get('all')
  getUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @swagger.ApiOkResponse({
    status: 200,
    description: 'Return the prompted user',
    type: User,
  })
  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }
}
