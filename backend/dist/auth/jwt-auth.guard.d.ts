declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
/**
 * Guard: Melindungi endpoint API agar hanya dapat diakses oleh pengguna yang memiliki token JWT valid.
 */
export declare class JwtAuthGuard extends JwtAuthGuard_base {
}
export {};
