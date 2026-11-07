import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    /**
     * Fungsi: Memvalidasi payload token JWT dan mengembalikan objek user ke request context.
     */
    validate(payload: any): Promise<{
        id_pengguna: any;
        username: any;
        nama: any;
        peran: any;
    }>;
}
export {};
