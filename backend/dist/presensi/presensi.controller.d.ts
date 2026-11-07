import { PresensiService } from './presensi.service';
import { TapCardDto, KoreksiPresensiDto } from './presensi.dto';
export declare class PresensiController {
    private readonly presensiService;
    constructor(presensiService: PresensiService);
    /**
     * Endpoint Publik: Menerima tap kartu RFID dari PC Terminal di pintu masuk laboratorium.
     * Catatan: Tidak memerlukan login/token karena diakses oleh mesin terminal dalam mode kios.
     */
    tapCard(tapCardDto: TapCardDto): Promise<{
        hasil: string;
        pesan: string;
        uid: string;
        waktu: Date;
        nama?: undefined;
        nim?: undefined;
        kelompok?: undefined;
        judul_proyek?: undefined;
        target_jam?: undefined;
        total_jam?: undefined;
        waktu_masuk?: undefined;
        durasi_menit?: undefined;
        durasi_formatted?: undefined;
    } | {
        hasil: string;
        pesan: string;
        nama: any;
        nim: any;
        kelompok: any;
        waktu: Date;
        uid?: undefined;
        judul_proyek?: undefined;
        target_jam?: undefined;
        total_jam?: undefined;
        waktu_masuk?: undefined;
        durasi_menit?: undefined;
        durasi_formatted?: undefined;
    } | {
        hasil: string;
        pesan: string;
        nama: any;
        nim: any;
        kelompok: any;
        judul_proyek: any;
        waktu: Date;
        target_jam: any;
        total_jam: number;
        uid?: undefined;
        waktu_masuk?: undefined;
        durasi_menit?: undefined;
        durasi_formatted?: undefined;
    } | {
        hasil: string;
        pesan: string;
        nama: any;
        nim: any;
        kelompok: any;
        judul_proyek: any;
        waktu_masuk: any;
        waktu: any;
        durasi_menit: any;
        durasi_formatted: string;
        target_jam: any;
        total_jam: number;
        uid?: undefined;
    }>;
    /**
     * Endpoint Terproteksi: Mengambil daftar riwayat seluruh log presensi untuk admin dan dosen.
     */
    getLogs(tanggal?: string, id_kelompok?: string, status_sesi?: string, search?: string): Promise<any[]>;
    /**
     * Endpoint Terproteksi: Mengambil daftar mahasiswa yang saat ini sedang aktif di dalam lab.
     */
    getActiveSessions(): Promise<any[]>;
    /**
     * Endpoint Khusus Admin: Mengoreksi sesi presensi mahasiswa yang lupa tap saat pulang.
     */
    koreksiPresensi(id: string, dto: KoreksiPresensiDto, req: any): Promise<{
        message: string;
        id_log: number;
    }>;
}
