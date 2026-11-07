import { DatabaseService } from '../database/database.service';
export declare class RekapService {
    private readonly databaseService;
    private readonly logger;
    constructor(databaseService: DatabaseService);
    /**
     * Fungsi: Mengambil data ringkasan metrik statistik untuk kartu dashboard administrator & dosen.
     */
    getDashboardStats(): Promise<{
        total_mahasiswa: any;
        sedang_di_lab: any;
        belum_pernah_hadir: number;
        memenuhi_target: number;
        belum_memenuhi_target: number;
        aktivitas_terbaru: any[];
    }>;
    /**
     * Fungsi: Mengambil rekap kehadiran per kelompok, anggota, akumulasi jam, serta penentuan status capaian otomatis.
     */
    getRekapKelompok(filter?: {
        id_kelompok?: number;
        id_dosen?: number;
        status?: string;
    }): Promise<any[]>;
}
