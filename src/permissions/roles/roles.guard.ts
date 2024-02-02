import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            throw new UnauthorizedException('Authorization header not found');
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Authorization token not found');
        }

        try {
            const payload = this.jwtService.verify(token);
            if (!payload) {
                throw new UnauthorizedException('Authorization token is invalid');
            }

            const userRoles = payload.roles;
            const hasRole = () => userRoles.some((role: string) => roles.includes(role));
            return payload && payload.roles && hasRole();
        } catch (error) {
            throw new UnauthorizedException('Invalid authorization token');
        }
    }
}
