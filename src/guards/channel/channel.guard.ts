import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChannelGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const channelId = request.params.id;

    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing.');
    }

    try {
        const userPayload = this.jwtService.decode(token);
        if (!userPayload) {
          throw new UnauthorizedException('Invalid token.');
        }

        const user = await this.prisma.user.findUnique({
          where: {
            id: userPayload.userId,
          },
          include: {
            channels: true,
          },
        });

        if (user.channels.includes(channelId)) {
            return true;
        } else {
            throw new UnauthorizedException('You do not have permission to access this channel.');
        }
    } catch (error) {
        throw new UnauthorizedException('Invalid token.');
    }
  }
}
