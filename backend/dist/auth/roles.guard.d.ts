import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class RolesGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    /**
     * Fungsi: Memeriksa apakah peran pengguna (user.peran) cocok dengan peran yang diizinkan untuk rute ini.
     */
    canActivate(context: ExecutionContext): boolean;
}
