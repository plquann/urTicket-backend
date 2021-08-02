import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log(
      '🚀 ~ file: roles.guard.ts ~ line 11 ~ RolesGuard ~ canActivate ~ roles',
      roles,
    );
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(
      '🚀 ~ file: roles.guard.ts ~ line 25 ~ RolesGuard ~ canActivate ~ user',
      user,
    );
    if (!user) {
      throw new UnauthorizedException('Permission Denied!');
    }

    // const hasRole = () => user.roles.some((role) => roles.includes(role));
    // console.log('🚀 ~ file: roles.guard.ts ~ line 30 ~ RolesGuard ~ canActivate ~ hasRole', hasRole());
    return roles.includes(user.roles);
  }
}
