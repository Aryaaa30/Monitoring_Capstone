import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './auth.dto';
export declare class AuthService {
    private readonly databaseService;
    private readonly jwtService;
    private readonly logger;
    constructor(databaseService: DatabaseService, jwtService: JwtService);
    /**
     * Fungsi: Melakukan autentikasi kredensial pengguna (admin/dosen) dan menerbitkan JWT token.
     */
    login(loginDto: LoginDto): Promise<{
        message: string;
        access_token: string;
        user: {
            id_pengguna: any;
            nama: any;
            username: any;
            peran: any;
        };
    }>;
    /**
     * Fungsi: Mengambil profil lengkap pengguna yang saat ini sedang login.
     */
    getProfile(id_pengguna: number): Promise<any>;
}
