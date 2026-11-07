import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Fungsi: Memeriksa apakah peran pengguna (user.peran) cocok dengan peran yang diizinkan untuk rute ini.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.peran) {
      throw new ForbiddenException('Akses ditolak: pengguna tidak memiliki informasi peran');
    }
    const hasRole = requiredRoles.includes(user.peran);
    if (!hasRole) {
      throw new ForbiddenException(`Akses ditolak: rute ini hanya untuk peran [${requiredRoles.join(', ')}]`);
    }
    return true;
  }
}
