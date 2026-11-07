export declare const ROLES_KEY = "roles";
/**
 * Decorator: Menandai peran (admin/dosen) yang diizinkan mengakses endpoint tertentu.
 */
export declare const Roles: (...roles: string[]) => import("@nestjs/common").CustomDecorator<string>;
