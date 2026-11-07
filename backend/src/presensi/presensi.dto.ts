import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';

/**
 * Data Transfer Object untuk permintaan tap kartu RFID dari terminal presensi.
 */
export class TapCardDto {
  @IsNotEmpty({ message: 'UID kartu tidak boleh kosong' })
  @IsString({ message: 'UID kartu harus berupa string' })
  uid: string;

  @IsOptional()
  @IsNumber({}, { message: 'Jeda detik harus berupa angka' })
  @Min(0, { message: 'Jeda detik minimal 0' })
  jeda_detik?: number;
}

/**
 * Data Transfer Object untuk formulir koreksi presensi (sesi yang lupa tap keluar).
 */
export class KoreksiPresensiDto {
  @IsNotEmpty({ message: 'Waktu keluar harus diisi' })
  @IsString({ message: 'Format waktu keluar harus berupa string tanggal/waktu ISO valid' })
  waktu_keluar: string;

  @IsNotEmpty({ message: 'Alasan koreksi harus diisi' })
  @IsString({ message: 'Alasan koreksi harus berupa teks' })
  catatan_koreksi: string;
}

