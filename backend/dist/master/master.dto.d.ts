/**
 * Data Transfer Object untuk menambah data mahasiswa baru.
 */
export declare class CreateMahasiswaDto {
    nim: string;
    nama: string;
    id_kelompok: number;
}
/**
 * Data Transfer Object untuk memperbarui data mahasiswa.
 */
export declare class UpdateMahasiswaDto {
    nama?: string;
    id_kelompok?: number;
    status_aktif?: boolean;
}
/**
 * Data Transfer Object untuk membuat kelompok capstone baru.
 */
export declare class CreateKelompokDto {
    nama_kelompok: string;
    judul_proyek?: string;
    id_dosen: number;
    target_jam?: number;
    periode_mulai: string;
    periode_selesai: string;
}
/**
 * Data Transfer Object untuk menambah data dosen pembimbing capstone.
 */
export declare class CreateDosenDto {
    nidn: string;
    nama: string;
}
/**
 * Data Transfer Object untuk registrasi awal kartu RFID ke mahasiswa.
 */
export declare class RegisterKartuDto {
    id_mahasiswa: number;
    uid_kartu: string;
}
/**
 * Data Transfer Object untuk penggantian kartu RFID yang hilang / rusak.
 */
export declare class GantiKartuDto {
    id_mahasiswa: number;
    uid_kartu_baru: string;
    alasan?: string;
}
