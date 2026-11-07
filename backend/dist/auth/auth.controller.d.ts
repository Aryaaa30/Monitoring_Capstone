import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    /**
     * Fungsi: Menerima permintaan login pengguna dari frontend dan mengembalikan JWT token.
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
     * Fungsi: Mengambil informasi detail profil user yang sedang aktif berdasarkan Bearer token.
     */
    getProfile(req: any): Promise<any>;
}
