import { DatabaseService } from '../database/database.service';
import { CreateMahasiswaDto, UpdateMahasiswaDto, CreateKelompokDto, CreateDosenDto, RegisterKartuDto, GantiKartuDto } from './master.dto';
export declare class MasterService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    /**
     * Fungsi: Mengambil seluruh daftar mahasiswa beserta informasi kelompok dan kartu RFID.
     */
    getMahasiswa(): Promise<any[]>;
    /**
     * Fungsi: Menambahkan data mahasiswa baru ke basis data.
     */
    createMahasiswa(dto: CreateMahasiswaDto, id_pengguna: number): Promise<{
        message: string;
    }>;
    /**
     * Fungsi: Mengubah informasi data mahasiswa.
     */
    updateMahasiswa(id_mahasiswa: number, dto: UpdateMahasiswaDto, id_pengguna: number): Promise<{
        message: string;
    }>;
    /**
     * Fungsi: Mengambil seluruh daftar kelompok capstone beserta dosen pembimbingnya.
     */
    getKelompok(): Promise<any[]>;
    /**
     * Fungsi: Menambahkan kelompok capstone baru beserta target jam dan periode pengerjaan.
     */
    createKelompok(dto: CreateKelompokDto, id_pengguna: number): Promise<{
        message: string;
    }>;
    /**
     * Fungsi: Mengambil seluruh daftar dosen pembimbing capstone.
     */
    getDosen(): Promise<any[]>;
    /**
     * Fungsi: Menambahkan data dosen pembimbing baru.
     */
    createDosen(dto: CreateDosenDto, id_pengguna: number): Promise<{
        message: string;
    }>;
    /**
     * Fungsi: Mengambil daftar seluruh kartu RFID beserta status dan pemiliknya.
     */
    getKartu(): Promise<any[]>;
    /**
     * Fungsi: Mendaftarkan kartu RFID baru untuk mahasiswa yang belum memiliki kartu aktif.
     */
    registerKartu(dto: RegisterKartuDto, id_pengguna: number): Promise<{
        message: string;
    }>;
    /**
     * Fungsi: Mengganti kartu RFID (menonaktifkan kartu lama yang hilang/rusak dan mendaftarkan kartu pengganti).
     */
    gantiKartu(dto: GantiKartuDto, id_pengguna: number): Promise<{
        message: string;
    }>;
}
