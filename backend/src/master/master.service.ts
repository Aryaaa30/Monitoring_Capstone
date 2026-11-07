import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreateMahasiswaDto,
  UpdateMahasiswaDto,
  CreateKelompokDto,
  CreateDosenDto,
  RegisterKartuDto,
  GantiKartuDto,
} from './master.dto';

@Injectable()
export class MasterService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ==========================================
  // 1. MODUL MASTER MAHASISWA
  // ==========================================

  /**
   * Fungsi: Mengambil seluruh daftar mahasiswa beserta informasi kelompok dan kartu RFID.
   */
  async getMahasiswa() {
    return this.databaseService.query(`
      SELECT 
        m.id_mahasiswa,
        m.nim,
        m.nama,
        m.status_aktif,
        k.id_kelompok,
        k.nama_kelompok,
        c.id_kartu,
        c.uid_kartu,
        c.status AS status_kartu
      FROM dbo.mstr_mahasiswa m
      LEFT JOIN dbo.mstr_kelompok k ON k.id_kelompok = m.id_kelompok
      LEFT JOIN dbo.mstr_kartu_rfid c ON c.id_mahasiswa = m.id_mahasiswa AND c.status = N'aktif'
      ORDER BY m.nim ASC
    `);
  }

  /**
   * Fungsi: Menambahkan data mahasiswa baru ke basis data.
   */
  async createMahasiswa(dto: CreateMahasiswaDto, id_pengguna: number) {
    const existing = await this.databaseService.query(
      `SELECT id_mahasiswa FROM dbo.mstr_mahasiswa WHERE nim = @nim`,
      { nim: dto.nim },
    );
    if (existing && existing.length > 0) {
      throw new BadRequestException(`Mahasiswa dengan NIM ${dto.nim} sudah terdaftar.`);
    }

    await this.databaseService.query(
      `INSERT INTO dbo.mstr_mahasiswa (nim, nama, id_kelompok, status_aktif, created_by)
       VALUES (@nim, @nama, @id_kelompok, 1, @id_pengguna)`,
      {
        nim: dto.nim,
        nama: dto.nama,
        id_kelompok: dto.id_kelompok,
        id_pengguna,
      },
    );

    return { message: 'Data mahasiswa berhasil ditambahkan' };
  }

  /**
   * Fungsi: Mengubah informasi data mahasiswa.
   */
  async updateMahasiswa(id_mahasiswa: number, dto: UpdateMahasiswaDto, id_pengguna: number) {
    const fields: string[] = [];
    const params: any = { id_mahasiswa, id_pengguna };

    if (dto.nama !== undefined) {
      fields.push(`nama = @nama`);
      params.nama = dto.nama;
    }
    if (dto.id_kelompok !== undefined) {
      fields.push(`id_kelompok = @id_kelompok`);
      params.id_kelompok = dto.id_kelompok;
    }
    if (dto.status_aktif !== undefined) {
      fields.push(`status_aktif = @status_aktif`);
      params.status_aktif = dto.status_aktif ? 1 : 0;
    }

    if (fields.length === 0) {
      return { message: 'Tidak ada perubahan data' };
    }

    fields.push(`updated_at = SYSDATETIME()`, `updated_by = @id_pengguna`);

    await this.databaseService.query(
      `UPDATE dbo.mstr_mahasiswa SET ${fields.join(', ')} WHERE id_mahasiswa = @id_mahasiswa`,
      params,
    );

    return { message: 'Data mahasiswa berhasil diperbarui' };
  }

  // ==========================================
  // 2. MODUL MASTER KELOMPOK
  // ==========================================

  /**
   * Fungsi: Mengambil seluruh daftar kelompok capstone beserta dosen pembimbingnya.
   */
  async getKelompok() {
    return this.databaseService.query(`
      SELECT 
        k.id_kelompok,
        k.nama_kelompok,
        k.judul_proyek,
        k.target_jam,
        k.periode_mulai,
        k.periode_selesai,
        d.id_dosen,
        d.nama AS dosen_pembimbing,
        (SELECT COUNT(id_mahasiswa) FROM dbo.mstr_mahasiswa m WHERE m.id_kelompok = k.id_kelompok) AS jumlah_anggota
      FROM dbo.mstr_kelompok k
      INNER JOIN dbo.mstr_dosen d ON d.id_dosen = k.id_dosen
      ORDER BY k.nama_kelompok ASC
    `);
  }

  /**
   * Fungsi: Menambahkan kelompok capstone baru beserta target jam dan periode pengerjaan.
   */
  async createKelompok(dto: CreateKelompokDto, id_pengguna: number) {
    await this.databaseService.query(
      `INSERT INTO dbo.mstr_kelompok (nama_kelompok, judul_proyek, id_dosen, target_jam, periode_mulai, periode_selesai, created_by)
       VALUES (@nama_kelompok, @judul_proyek, @id_dosen, @target_jam, @periode_mulai, @periode_selesai, @id_pengguna)`,
      {
        nama_kelompok: dto.nama_kelompok,
        judul_proyek: dto.judul_proyek || '',
        id_dosen: dto.id_dosen,
        target_jam: dto.target_jam || 20,
        periode_mulai: dto.periode_mulai,
        periode_selesai: dto.periode_selesai,
        id_pengguna,
      },
    );
    return { message: 'Kelompok capstone berhasil dibuat' };
  }

  // ==========================================
  // 3. MODUL MASTER DOSEN
  // ==========================================

  /**
   * Fungsi: Mengambil seluruh daftar dosen pembimbing capstone.
   */
  async getDosen() {
    return this.databaseService.query(`
      SELECT 
        id_dosen,
        nidn,
        nama,
        created_at
      FROM dbo.mstr_dosen
      ORDER BY nama ASC
    `);
  }

  /**
   * Fungsi: Menambahkan data dosen pembimbing baru.
   */
  async createDosen(dto: CreateDosenDto, id_pengguna: number) {
    const existing = await this.databaseService.query(
      `SELECT id_dosen FROM dbo.mstr_dosen WHERE nidn = @nidn`,
      { nidn: dto.nidn },
    );
    if (existing && existing.length > 0) {
      throw new BadRequestException(`Dosen dengan NIDN ${dto.nidn} sudah terdaftar.`);
    }

    await this.databaseService.query(
      `INSERT INTO dbo.mstr_dosen (nidn, nama, created_by)
       VALUES (@nidn, @nama, @id_pengguna)`,
      { nidn: dto.nidn, nama: dto.nama, id_pengguna },
    );
    return { message: 'Data dosen berhasil ditambahkan' };
  }

  // ==========================================
  // 4. MODUL REGISTRASI & KARTU RFID
  // ==========================================

  /**
   * Fungsi: Mengambil daftar seluruh kartu RFID beserta status dan pemiliknya.
   */
  async getKartu() {
    return this.databaseService.query(`
      SELECT 
        c.id_kartu,
        c.uid_kartu,
        c.status,
        c.tanggal_registrasi,
        m.id_mahasiswa,
        m.nim,
        m.nama AS nama_mahasiswa,
        k.nama_kelompok
      FROM dbo.mstr_kartu_rfid c
      INNER JOIN dbo.mstr_mahasiswa m ON m.id_mahasiswa = c.id_mahasiswa
      LEFT JOIN dbo.mstr_kelompok k ON k.id_kelompok = m.id_kelompok
      ORDER BY c.tanggal_registrasi DESC
    `);
  }

  /**
   * Fungsi: Mendaftarkan kartu RFID baru untuk mahasiswa yang belum memiliki kartu aktif.
   */
  async registerKartu(dto: RegisterKartuDto, id_pengguna: number) {
    const cleanUid = dto.uid_kartu.trim();

    // Pastikan UID belum dipakai kartu aktif lain
    const existingUid = await this.databaseService.query(
      `SELECT id_kartu FROM dbo.mstr_kartu_rfid WHERE uid_kartu = @uid AND status = N'aktif'`,
      { uid: cleanUid },
    );
    if (existingUid && existingUid.length > 0) {
      throw new BadRequestException(`UID ${cleanUid} sudah digunakan oleh kartu aktif lain.`);
    }

    // Pastikan mahasiswa tidak memiliki kartu aktif ganda
    const existingMhs = await this.databaseService.query(
      `SELECT id_kartu FROM dbo.mstr_kartu_rfid WHERE id_mahasiswa = @id_mahasiswa AND status = N'aktif'`,
      { id_mahasiswa: dto.id_mahasiswa },
    );
    if (existingMhs && existingMhs.length > 0) {
      throw new BadRequestException(`Mahasiswa ini sudah memiliki kartu aktif. Gunakan menu ganti kartu jika kartu hilang.`);
    }

    await this.databaseService.query(
      `INSERT INTO dbo.mstr_kartu_rfid (id_mahasiswa, uid_kartu, status, created_by)
       VALUES (@id_mahasiswa, @uid, N'aktif', @id_pengguna)`,
      {
        id_mahasiswa: dto.id_mahasiswa,
        uid: cleanUid,
        id_pengguna,
      },
    );

    return { message: `Kartu RFID UID ${cleanUid} berhasil diregistrasikan ke mahasiswa.` };
  }

  /**
   * Fungsi: Mengganti kartu RFID (menonaktifkan kartu lama yang hilang/rusak dan mendaftarkan kartu pengganti).
   */
  async gantiKartu(dto: GantiKartuDto, id_pengguna: number) {
    const cleanUid = dto.uid_kartu_baru.trim();

    // 1. Nonaktifkan seluruh kartu aktif sebelumnya milik mahasiswa ini
    await this.databaseService.query(
      `UPDATE dbo.mstr_kartu_rfid
       SET status = N'nonaktif',
           updated_at = SYSDATETIME(),
           updated_by = @id_pengguna
       WHERE id_mahasiswa = @id_mahasiswa AND status = N'aktif'`,
      { id_mahasiswa: dto.id_mahasiswa, id_pengguna },
    );

    // 2. Daftarkan kartu baru
    await this.databaseService.query(
      `INSERT INTO dbo.mstr_kartu_rfid (id_mahasiswa, uid_kartu, status, created_by)
       VALUES (@id_mahasiswa, @uid, N'aktif', @id_pengguna)`,
      {
        id_mahasiswa: dto.id_mahasiswa,
        uid: cleanUid,
        id_pengguna,
      },
    );

    return { message: `Kartu lama dinonaktifkan dan kartu baru ${cleanUid} berhasil diaktifkan.` };
  }
}

