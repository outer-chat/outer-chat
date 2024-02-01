import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

import { UserService } from '../services';
import { User } from '../dto';

import { Role } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';

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
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @swagger.ApiOkResponse({
    status: 200,
    description: 'Return the prompted user',
    type: User,
  })
  @Get(':id')
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }
}
