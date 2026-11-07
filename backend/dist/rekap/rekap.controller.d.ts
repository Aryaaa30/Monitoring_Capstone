import { RekapService } from './rekap.service';
export declare class RekapController {
    private readonly rekapService;
    constructor(rekapService: RekapService);
    /**
     * Fungsi: Mengambil data statistik kartu dashboard ringkasan untuk monitoring lab.
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
     * Fungsi: Mengambil laporan rekap per kelompok, anggota, akumulasi jam, dan status capaian (ekspor PDF & tabel).
     */
    getRekapKelompok(id_kelompok?: string, id_dosen?: string, status?: string): Promise<any[]>;
}
