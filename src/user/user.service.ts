import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../dto';
import { User as PrimsaUser } from '@prisma/client/edge';
import * as bcrypt from 'bcrypt';
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

  async patchUser(id: string, user: PrimsaUser): Promise<string> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userExists)
      throw new NotFoundException(`User with id ${id} does not exist!`);

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

    if (user.password) {
      if (typeof user.password !== 'string' || user.password.trim() === '')
        throw new BadRequestException('Password must be a non empty string');

      if (!user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
        throw new BadRequestException('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character');

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
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
        password: user?.password ?? undefined,
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

    return "User updated successfully!";
  }

  async deleteUser(id: string): Promise<string> {
    const user = await this.prisma.user.delete({
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

    return "User deleted successfully!";
  }
}
