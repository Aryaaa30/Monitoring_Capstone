import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'monitoring_capstone_jwt_super_secret_key_2026_umy'),
    });
  }

  /**
   * Fungsi: Memvalidasi payload token JWT dan mengembalikan objek user ke request context.
   */
  async validate(payload: any) {
    if (!payload || !payload.id_pengguna) {
      throw new UnauthorizedException('Token tidak valid');
    }
    return {
      id_pengguna: payload.id_pengguna,
      username: payload.username,
      nama: payload.nama,
      peran: payload.peran,
    };
  }
}

