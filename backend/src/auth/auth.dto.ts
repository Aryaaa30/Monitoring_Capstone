import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object untuk permintaan login pengguna (Admin / Dosen).
 */
export class LoginDto {
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString({ message: 'Username harus berupa teks' })
  username: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString({ message: 'Password harus berupa teks' })
  @MinLength(4, { message: 'Password minimal 4 karakter' })
  password: string;
}

