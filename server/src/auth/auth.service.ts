import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client/edge'
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerUser(user: PrismaUser): Promise<Tokens> {
    const allowedUsernameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@";

    if (!user || !user.email || !user.password || !user.username)
      throw new BadRequestException('Bad request : username, password and email fields are required');
    if (user.username.split('').some((char: string) => !allowedUsernameCharacters.includes(char)))
      throw new BadRequestException('Username contains invalid characters, allowed characters are: a-z, A-Z, 0-9, -, ., _, @');

    const isEmailTaken = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (isEmailTaken)
      throw new BadRequestException('Email is already taken');

    if (!user.email.match(/^.+@.+\..+$/))
      throw new BadRequestException('Email is not valid');

    const isUsernameTaken = await this.prisma.user.findUnique({
      where: {
        username: user.username,
      },
    });

    if (isUsernameTaken)
      throw new BadRequestException('Username is already taken');

    if (typeof user.password !== 'string' || user.password.trim() === '')
      throw new BadRequestException('Password must be a non empty string');

    if (!user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
      throw new BadRequestException('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        password: hashedPassword,
      },
    });

    const accessToken = jwt.sign({ userId: newUser.id, roles: newUser.roles }, process.env.SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: newUser.id, roles: newUser.roles }, process.env.SECRET, { expiresIn: '7d' });

    return {
      accessToken: {
        token: accessToken,
        tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
      },
      refreshToken: {
        token: refreshToken,
        tokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      }
    };
  }

  async loginUser(user: PrismaUser): Promise<Tokens> {
    if (!user?.email && !user?.username)
      throw new BadRequestException('Bad request : username or email is required');

    if (!user.password)
      throw new BadRequestException('Bad request : password is required');

    let foundUser: PrismaUser;

    if (user.email)
      foundUser = await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

    if (!foundUser && user.username) {
      foundUser = await this.prisma.user.findUnique({
        where: {
          username: user.username,
        },
      });
    }

    if (!foundUser)
      throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const accessToken = jwt.sign({ userId: foundUser.id, roles: foundUser.roles }, process.env.SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: foundUser.id, roles: foundUser.roles }, process.env.SECRET, { expiresIn: '7d' });

    return {
      accessToken: {
        token: accessToken,
        tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
      },
      refreshToken: {
        token: refreshToken,
        tokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      }
    };
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    const decodedRefreshToken = this.jwtService.verify(refreshToken);

    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: decodedRefreshToken.userId,
      },
    });

    if (!foundUser)
      throw new UnauthorizedException('Invalid credentials');

    const accessToken = jwt.sign({ userId: foundUser.id, roles: foundUser.roles }, process.env.SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ userId: foundUser.id, roles: foundUser.roles }, process.env.SECRET, { expiresIn: '7d' });

    return {
      accessToken: {
        token: accessToken,
        tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
      },
      refreshToken: {
        token: newRefreshToken,
        tokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      }
    };
  }
}
