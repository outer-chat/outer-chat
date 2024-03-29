import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ChannelGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
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
        const user = this.jwtService.decode(token);
        if (!user) {
          throw new UnauthorizedException('Invalid token.');
        }
        if (user.channelId.includes(channelId)) {
            return true;
        } else {
            throw new UnauthorizedException('You do not have permission to access this channel.');
        }
    } catch (error) {
        throw new UnauthorizedException('Invalid token.');
    }
  }
}
