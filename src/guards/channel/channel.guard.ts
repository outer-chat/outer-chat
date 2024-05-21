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
      const payload = this.jwtService.verify(token);
      const userId = payload['userId'];

      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
        include: {
          recipients: true,
        },
      });

      if (!channel) {
        throw new UnauthorizedException('Channel does not exist.');
      }

      const isRecipient = channel.recipients.some((recipient) => recipient.userId === userId);
      if (!isRecipient) {
        throw new UnauthorizedException('You are not a recipient of this channel.');
      }

      return true;

    } catch (error) {
        throw new UnauthorizedException('Invalid token.');
    }
  }
}
