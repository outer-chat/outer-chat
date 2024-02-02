import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

import { UserService } from '../services';
import { User } from '../dto';
import { User as PrismaUser } from '@prisma/client/edge';

import { Role } from '../permissions/roles/roles.enum';
import { Roles } from '../permissions/roles/roles.decorator';
import { RolesGuard } from '../permissions/roles/roles.guard';
import { SelfGuard } from '../permissions/self/self.guard';

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
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(RolesGuard)
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @swagger.ApiOkResponse({
    status: 200,
    description: 'Return the patched user and a message',
    type: String
  })
  @Patch(':id')
  @UseGuards(SelfGuard)
  patchUser(@Param('id') id: string, @Body() user: PrismaUser): Promise<string> {
    return this.userService.patchUser(id, user);
  }

  @swagger.ApiOkResponse({
    status: 200,
    description: 'Return the deleted user',
    type: String
  })
  @Delete(':id')
  @UseGuards(SelfGuard)
  deleteUser(@Param('id') id: string): Promise<string> {
    return this.userService.deleteUser(id);
  }
}
