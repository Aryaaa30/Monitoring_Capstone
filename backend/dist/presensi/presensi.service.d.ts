import { DatabaseService } from '../database/database.service';
import { TapCardDto, KoreksiPresensiDto } from './presensi.dto';
export declare class PresensiService {
    private readonly databaseService;
    private readonly logger;
    constructor(databaseService: DatabaseService);
    /**
     * Fungsi: Memproses penempelan kartu RFID pada terminal presensi (Check-in / Check-out otomatis).
     * Alur: Cek kartu aktif -> Validasi debounce 10 detik -> Cek sesi terbuka -> Masuk / Keluar.
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
     * Fungsi: Menghitung akumulasi jam kehadiran mahasiswa dari sesi presensi yang telah ditutup.
     */
    hitungTotalJam(id_mahasiswa: number): Promise<number>;
    /**
     * Fungsi: Mengambil daftar riwayat seluruh log presensi dengan filter tanggal, kelompok, dan status sesi.
     */
    getLogs(filter?: {
        tanggal?: string;
        id_kelompok?: number;
        status_sesi?: string;
        search?: string;
    }): Promise<any[]>;
    /**
     * Fungsi: Mengambil daftar mahasiswa yang saat ini sedang berada di laboratorium (sesi aktif/terbuka).
     */
    getActiveSessions(): Promise<any[]>;
    /**
     * Fungsi: Mengoreksi sesi presensi secara manual oleh admin bila mahasiswa lupa tap keluar saat pulang.
     */
    koreksiPresensi(id_log: number, dto: KoreksiPresensiDto, id_pengguna: number): Promise<{
        message: string;
        id_log: number;
    }>;
}
