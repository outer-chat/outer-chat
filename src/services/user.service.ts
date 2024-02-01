import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
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
        roles: true,
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
        roles: true,
      },
    });

    if (!user)
      throw new NotFoundException(`User with id ${id} does not exist!`);

    return user;
  }

  async patchUser(id: string, user: User): Promise<User> {
    const allowedUsernameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@";

    if (user.username && user.username.split('').some((char: string) => !allowedUsernameCharacters.includes(char)))
      throw new BadRequestException('Username contains invalid characters, allowed characters are: a-z, A-Z, 0-9, -, ., _, @');

    if (user.email) {
      const isEmailTaken = await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (isEmailTaken && isEmailTaken.id !== id)
        throw new BadRequestException('Email is already taken');

      if (!user.email.match(/^.+@.+\..+$/))
        throw new BadRequestException('Email is not valid');
    }

    if (user.username) {
      const isUsernameTaken = await this.prisma.user.findUnique({
        where: {
          username: user.username,
        },
      });

      if (isUsernameTaken && isUsernameTaken.id !== id)
        throw new BadRequestException('Username is already taken');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: user?.email ?? undefined,
        username: user?.username ?? undefined,
        avatar: user?.avatar ?? undefined,
        banner: user?.banner ?? undefined,
        bannerColor: user?.bannerColor ?? undefined,
        bio: user?.bio ?? undefined,
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
        roles: true,
      },
    });

    if (!updatedUser)
      throw new NotFoundException(`User with id ${id} does not exist!`);

    return updatedUser;
  }
}
