import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TapCardDto, KoreksiPresensiDto } from './presensi.dto';

@Injectable()
export class PresensiService {
  private readonly logger = new Logger(PresensiService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Fungsi: Memproses penempelan kartu RFID pada terminal presensi (Check-in / Check-out otomatis).
   * Alur: Cek kartu aktif -> Validasi debounce 10 detik -> Cek sesi terbuka -> Masuk / Keluar.
   */
  async tapCard(tapCardDto: TapCardDto) {
    const { uid, jeda_detik = 10 } = tapCardDto;
    const cleanUid = uid.trim();

    // 1. Cari kartu RFID aktif dan mahasiswa terkait
    const kartuData = await this.databaseService.query(
      `SELECT 
          c.id_kartu,
          c.uid_kartu,
          m.id_mahasiswa,
          m.nim,
          m.nama,
          k.id_kelompok,
          k.nama_kelompok,
          k.judul_proyek,
          k.target_jam
       FROM dbo.mstr_kartu_rfid c
       INNER JOIN dbo.mstr_mahasiswa m ON m.id_mahasiswa = c.id_mahasiswa
       INNER JOIN dbo.mstr_kelompok k ON k.id_kelompok = m.id_kelompok
       WHERE c.uid_kartu = @uid
         AND c.status = N'aktif'
         AND m.status_aktif = 1`,
      { uid: cleanUid },
    );

    // Jika kartu tidak terdaftar atau non-aktif
    if (!kartuData || kartuData.length === 0) {
      return {
        hasil: 'KARTU_TIDAK_TERDAFTAR',
        pesan: 'Kartu RFID belum terdaftar dalam sistem. Silakan hubungi admin laboratorium.',
        uid: cleanUid,
        waktu: new Date(),
      };
    }

    const mhs = kartuData[0];

    // 2. Cek jeda tap terakhir (debounce) untuk mencegah tap ganda yang tidak disengaja
    const aktivitasTerakhir = await this.databaseService.query(
      `SELECT TOP 1
          ISNULL(waktu_keluar, waktu_masuk) AS waktu_terakhir,
          DATEDIFF(SECOND, ISNULL(waktu_keluar, waktu_masuk), SYSDATETIME()) AS selisih_detik
       FROM dbo.tr_log_presensi
       WHERE id_mahasiswa = @id_mahasiswa
       ORDER BY waktu_masuk DESC`,
      { id_mahasiswa: mhs.id_mahasiswa },
    );

    if (
      aktivitasTerakhir &&
      aktivitasTerakhir.length > 0 &&
      aktivitasTerakhir[0].selisih_detik !== null &&
      aktivitasTerakhir[0].selisih_detik < jeda_detik
    ) {
      return {
        hasil: 'TAP_GANDA',
        pesan: `Kartu baru saja ditempelkan ${aktivitasTerakhir[0].selisih_detik} detik lalu. Mohon tunggu sejenak.`,
        nama: mhs.nama,
        nim: mhs.nim,
        kelompok: mhs.nama_kelompok,
        waktu: new Date(),
      };
    }

    // 3. Cek apakah ada sesi presensi yang sedang terbuka (masuk belum keluar)
    const sesiTerbuka = await this.databaseService.query(
      `SELECT TOP 1 id_log, waktu_masuk
       FROM dbo.tr_log_presensi
       WHERE id_mahasiswa = @id_mahasiswa
         AND waktu_keluar IS NULL
       ORDER BY waktu_masuk DESC`,
      { id_mahasiswa: mhs.id_mahasiswa },
    );

    // 4A. JIKA BELUM ADA SESI TERBUKA -> PROSES TAP MASUK
    if (!sesiTerbuka || sesiTerbuka.length === 0) {
      await this.databaseService.query(
        `INSERT INTO dbo.tr_log_presensi (id_mahasiswa, waktu_masuk, metode)
         VALUES (@id_mahasiswa, SYSDATETIME(), N'rfid')`,
        { id_mahasiswa: mhs.id_mahasiswa },
      );

      const totalJam = await this.hitungTotalJam(mhs.id_mahasiswa);

      return {
        hasil: 'MASUK',
        pesan: `Presensi Masuk Berhasil! Selamat datang di laboratorium, ${mhs.nama}.`,
        nama: mhs.nama,
        nim: mhs.nim,
        kelompok: mhs.nama_kelompok,
        judul_proyek: mhs.judul_proyek,
        waktu: new Date(),
        target_jam: mhs.target_jam,
        total_jam: totalJam,
      };
    }

    // 4B. JIKA ADA SESI TERBUKA -> PROSES TAP KELUAR DAN HITUNG DURASI
    const idLog = sesiTerbuka[0].id_log;
    const waktuMasuk = sesiTerbuka[0].waktu_masuk;

    await this.databaseService.query(
      `UPDATE dbo.tr_log_presensi
       SET waktu_keluar = SYSDATETIME(),
           updated_at = SYSDATETIME()
       WHERE id_log = @idLog`,
      { idLog },
    );

    // Ambil log yang baru saja diupdate untuk membaca durasi_menit hasil computed column
    const logSelesai = await this.databaseService.query(
      `SELECT durasi_menit, waktu_masuk, waktu_keluar
       FROM dbo.tr_log_presensi
       WHERE id_log = @idLog`,
      { idLog },
    );

    const durasiMenit = logSelesai[0]?.durasi_menit || 0;
    const totalJam = await this.hitungTotalJam(mhs.id_mahasiswa);
    const jam = Math.floor(durasiMenit / 60);
    const menit = durasiMenit % 60;
    const durasiFormatted = jam > 0 ? `${jam} jam ${menit} menit` : `${menit} menit`;

    return {
      hasil: 'KELUAR',
      pesan: `Presensi Keluar Berhasil! Terima kasih atas kehadiran Anda. Durasi sesi ini: ${durasiFormatted}.`,
      nama: mhs.nama,
      nim: mhs.nim,
      kelompok: mhs.nama_kelompok,
      judul_proyek: mhs.judul_proyek,
      waktu_masuk: waktuMasuk,
      waktu: logSelesai[0]?.waktu_keluar || new Date(),
      durasi_menit: durasiMenit,
      durasi_formatted: durasiFormatted,
      target_jam: mhs.target_jam,
      total_jam: totalJam,
    };
  }

  /**
   * Fungsi: Menghitung akumulasi jam kehadiran mahasiswa dari sesi presensi yang telah ditutup.
   */
  async hitungTotalJam(id_mahasiswa: number): Promise<number> {
    const hasil = await this.databaseService.query(
      `SELECT CAST(ISNULL(SUM(durasi_menit), 0) / 60.0 AS DECIMAL(7,2)) AS total_jam
       FROM dbo.tr_log_presensi
       WHERE id_mahasiswa = @id_mahasiswa
         AND waktu_keluar IS NOT NULL`,
      { id_mahasiswa },
    );
    return parseFloat(hasil[0]?.total_jam || '0');
  }

  /**
   * Fungsi: Mengambil daftar riwayat seluruh log presensi dengan filter tanggal, kelompok, dan status sesi.
   */
  async getLogs(filter?: {
    tanggal?: string;
    id_kelompok?: number;
    status_sesi?: string;
    search?: string;
  }) {
    let sqlQuery = `
      SELECT 
        l.id_log,
        l.id_mahasiswa,
        m.nim,
        m.nama AS nama_mahasiswa,
        k.nama_kelompok,
        d.nama AS dosen_pembimbing,
        l.waktu_masuk,
        l.waktu_keluar,
        l.durasi_menit,
        l.metode,
        l.status_sesi,
        l.catatan_koreksi,
        p.nama AS dikoreksi_oleh_nama
      FROM dbo.tr_log_presensi l
      INNER JOIN dbo.mstr_mahasiswa m ON m.id_mahasiswa = l.id_mahasiswa
      INNER JOIN dbo.mstr_kelompok k ON k.id_kelompok = m.id_kelompok
      INNER JOIN dbo.mstr_dosen d ON d.id_dosen = k.id_dosen
      LEFT JOIN dbo.mstr_pengguna p ON p.id_pengguna = l.dikoreksi_oleh
      WHERE 1=1
    `;

    const params: any = {};

    if (filter?.tanggal) {
      sqlQuery += ` AND CAST(l.waktu_masuk AS DATE) = @tanggal`;
      params.tanggal = filter.tanggal;
    }

    if (filter?.id_kelompok) {
      sqlQuery += ` AND k.id_kelompok = @id_kelompok`;
      params.id_kelompok = filter.id_kelompok;
    }

    if (filter?.status_sesi) {
      sqlQuery += ` AND l.status_sesi = @status_sesi`;
      params.status_sesi = filter.status_sesi;
    }

    if (filter?.search) {
      sqlQuery += ` AND (m.nama LIKE @search OR m.nim LIKE @search OR k.nama_kelompok LIKE @search)`;
      params.search = `%${filter.search}%`;
    }

    sqlQuery += ` ORDER BY l.waktu_masuk DESC`;

    return this.databaseService.query(sqlQuery, params);
  }

  /**
   * Fungsi: Mengambil daftar mahasiswa yang saat ini sedang berada di laboratorium (sesi aktif/terbuka).
   */
  async getActiveSessions() {
    return this.databaseService.query(`
      SELECT 
        l.id_log,
        m.nim,
        m.nama AS nama_mahasiswa,
        k.nama_kelompok,
        d.nama AS dosen_pembimbing,
        l.waktu_masuk,
        DATEDIFF(MINUTE, l.waktu_masuk, SYSDATETIME()) AS berjalan_menit
      FROM dbo.tr_log_presensi l
      INNER JOIN dbo.mstr_mahasiswa m ON m.id_mahasiswa = l.id_mahasiswa
      INNER JOIN dbo.mstr_kelompok k ON k.id_kelompok = m.id_kelompok
      INNER JOIN dbo.mstr_dosen d ON d.id_dosen = k.id_dosen
      WHERE l.waktu_keluar IS NULL
      ORDER BY l.waktu_masuk DESC
    `);
  }

  /**
   * Fungsi: Mengoreksi sesi presensi secara manual oleh admin bila mahasiswa lupa tap keluar saat pulang.
   */
  async koreksiPresensi(id_log: number, dto: KoreksiPresensiDto, id_pengguna: number) {
    const existing = await this.databaseService.query(
      `SELECT id_log, waktu_masuk, waktu_keluar FROM dbo.tr_log_presensi WHERE id_log = @id_log`,
      { id_log },
    );

    if (!existing || existing.length === 0) {
      throw new NotFoundException(`Log presensi dengan ID ${id_log} tidak ditemukan.`);
    }

    const log = existing[0];
    const waktuKeluarDate = new Date(dto.waktu_keluar);
    const waktuMasukDate = new Date(log.waktu_masuk);

    if (waktuKeluarDate <= waktuMasukDate) {
      throw new BadRequestException('Waktu keluar koreksi harus lebih besar dari waktu masuk.');
    }

    await this.databaseService.query(
      `UPDATE dbo.tr_log_presensi
       SET waktu_keluar = @waktu_keluar,
           metode = N'koreksi',
           dikoreksi_oleh = @id_pengguna,
           catatan_koreksi = @catatan_koreksi,
           updated_at = SYSDATETIME(),
           updated_by = @id_pengguna
       WHERE id_log = @id_log`,
      {
        id_log,
        waktu_keluar: dto.waktu_keluar,
        id_pengguna,
        catatan_koreksi: dto.catatan_koreksi,
      },
    );

    return {
      message: 'Sesi presensi berhasil dikoreksi oleh administrator.',
      id_log,
    };
  }
}

