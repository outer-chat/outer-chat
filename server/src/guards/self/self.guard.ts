import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userIdParam = request.params.id;

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
      const userId = payload.userId;
      const roles = payload.roles;

      if (userId === userIdParam || (roles && roles.includes('ADMIN'))) {
        return true;
      } else {
        throw new UnauthorizedException('You can only modify your own profile unless you are an admin.');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token.');
    }
  }
}
