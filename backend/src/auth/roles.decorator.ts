import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/**
 * Decorator: Menandai peran (admin/dosen) yang diizinkan mengakses endpoint tertentu.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

