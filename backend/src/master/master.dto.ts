import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

/**
 * Data Transfer Object untuk menambah data mahasiswa baru.
 */
export class CreateMahasiswaDto {
  @IsNotEmpty({ message: 'NIM tidak boleh kosong' })
  @IsString({ message: 'NIM harus berupa teks' })
  nim: string;

  @IsNotEmpty({ message: 'Nama mahasiswa tidak boleh kosong' })
  @IsString({ message: 'Nama harus berupa teks' })
  nama: string;

  @IsNotEmpty({ message: 'ID Kelompok tidak boleh kosong' })
  @IsNumber({}, { message: 'ID Kelompok harus berupa angka' })
  id_kelompok: number;
}

/**
 * Data Transfer Object untuk memperbarui data mahasiswa.
 */
export class UpdateMahasiswaDto {
  @IsOptional()
  @IsString({ message: 'Nama harus berupa teks' })
  nama?: string;

  @IsOptional()
  @IsNumber({}, { message: 'ID Kelompok harus berupa angka' })
  id_kelompok?: number;

  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus berupa boolean' })
  status_aktif?: boolean;
}

/**
 * Data Transfer Object untuk membuat kelompok capstone baru.
 */
export class CreateKelompokDto {
  @IsNotEmpty({ message: 'Nama kelompok tidak boleh kosong' })
  @IsString()
  nama_kelompok: string;

  @IsOptional()
  @IsString()
  judul_proyek?: string;

  @IsNotEmpty({ message: 'ID Dosen pembimbing wajib dipilih' })
  @IsNumber()
  id_dosen: number;

  @IsOptional()
  @IsNumber()
  target_jam?: number;

  @IsNotEmpty({ message: 'Tanggal mulai periode wajib diisi' })
  @IsString()
  periode_mulai: string;

  @IsNotEmpty({ message: 'Tanggal selesai periode wajib diisi' })
  @IsString()
  periode_selesai: string;
}

/**
 * Data Transfer Object untuk menambah data dosen pembimbing capstone.
 */
export class CreateDosenDto {
  @IsNotEmpty({ message: 'NIDN tidak boleh kosong' })
  @IsString()
  nidn: string;

  @IsNotEmpty({ message: 'Nama dosen tidak boleh kosong' })
  @IsString()
  nama: string;
}

/**
 * Data Transfer Object untuk registrasi awal kartu RFID ke mahasiswa.
 */
export class RegisterKartuDto {
  @IsNotEmpty({ message: 'ID Mahasiswa wajib diisi' })
  @IsNumber()
  id_mahasiswa: number;

  @IsNotEmpty({ message: 'Nomor UID kartu wajib diisi' })
  @IsString()
  uid_kartu: string;
}

/**
 * Data Transfer Object untuk penggantian kartu RFID yang hilang / rusak.
 */
export class GantiKartuDto {
  @IsNotEmpty({ message: 'ID Mahasiswa wajib diisi' })
  @IsNumber()
  id_mahasiswa: number;

  @IsNotEmpty({ message: 'UID kartu baru wajib diisi' })
  @IsString()
  uid_kartu_baru: string;

  @IsOptional()
  @IsString()
  alasan?: string;
}

