import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard: Melindungi endpoint API agar hanya dapat diakses oleh pengguna yang memiliki token JWT valid.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

