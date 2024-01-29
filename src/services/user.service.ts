import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
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

    return users as unknown as User[];
  }

  async getUser(id: string): Promise<User> {
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
        banner: true,
        bannerColor: true,
        bio: true,
      },
    });

    if (!user)
      throw new NotFoundException(`User with id ${id} does not exist!`);

    return user;
  }
}
