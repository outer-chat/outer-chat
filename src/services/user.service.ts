import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client/edge'
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
      },
    });

    return users;
  }

  async getUser(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
      },
    });

    if (!user)
      throw new NotFoundException(`User with id ${id} does not exist!`);

    return user;
  }
}
