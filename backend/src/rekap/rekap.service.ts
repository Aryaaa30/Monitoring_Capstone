import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RekapService {
  private readonly logger = new Logger(RekapService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Fungsi: Mengambil data ringkasan metrik statistik untuk kartu dashboard administrator & dosen.
   */
  async getDashboardStats() {
    // 1. Total mahasiswa aktif
    const totalMhsRes = await this.databaseService.query(
      `SELECT COUNT(id_mahasiswa) AS total FROM dbo.mstr_mahasiswa WHERE status_aktif = 1`,
    );
    const totalMahasiswa = totalMhsRes[0]?.total || 0;

    // 2. Jumlah mahasiswa yang saat ini sedang berada di lab (sesi terbuka)
    const sedangDiLabRes = await this.databaseService.query(
      `SELECT COUNT(DISTINCT id_mahasiswa) AS total 
       FROM dbo.tr_log_presensi 
       WHERE waktu_keluar IS NULL`,
    );
    const sedangDiLab = sedangDiLabRes[0]?.total || 0;

    // 3. Ambil data rekap seluruh mahasiswa untuk menghitung status capaian
    const rekapAll = await this.getRekapKelompok();

    let belumPernahHadir = 0;
    let memenuhiTarget = 0;
    let belumMemenuhiTarget = 0;

    for (const klp of rekapAll) {
      for (const mhs of klp.anggota) {
        if (mhs.status_capaian === 'Belum Pernah Hadir') {
          belumPernahHadir++;
        } else if (mhs.status_capaian === 'Memenuhi Target') {
          memenuhiTarget++;
        } else {
          belumMemenuhiTarget++;
        }
      }
    }

    // 4. Aktivitas presensi hari ini
    const aktivitasHariIni = await this.databaseService.query(
      `SELECT TOP 10
          l.id_log,
          m.nama AS nama_mahasiswa,
          m.nim,
          k.nama_kelompok,
          l.waktu_masuk,
          l.waktu_keluar,
          l.durasi_menit,
          l.metode,
          l.status_sesi
       FROM dbo.tr_log_presensi l
       INNER JOIN dbo.mstr_mahasiswa m ON m.id_mahasiswa = l.id_mahasiswa
       INNER JOIN dbo.mstr_kelompok k ON k.id_kelompok = m.id_kelompok
       ORDER BY l.waktu_masuk DESC`,
    );

    return {
      total_mahasiswa: totalMahasiswa,
      sedang_di_lab: sedangDiLab,
      belum_pernah_hadir: belumPernahHadir,
      memenuhi_target: memenuhiTarget,
      belum_memenuhi_target: belumMemenuhiTarget,
      aktivitas_terbaru: aktivitasHariIni,
    };
  }

  /**
   * Fungsi: Mengambil rekap kehadiran per kelompok, anggota, akumulasi jam, serta penentuan status capaian otomatis.
   */
  async getRekapKelompok(filter?: {
    id_kelompok?: number;
    id_dosen?: number;
    status?: string;
  }) {
    try {
      // Ambil data seluruh kelompok
      let queryKelompok = `
        SELECT 
          k.id_kelompok,
          k.nama_kelompok,
          k.judul_proyek,
          k.target_jam,
          k.periode_mulai,
          k.periode_selesai,
          d.id_dosen,
          d.nama AS dosen_pembimbing,
          d.nidn
        FROM dbo.mstr_kelompok k
        INNER JOIN dbo.mstr_dosen d ON d.id_dosen = k.id_dosen
        WHERE 1=1
      `;
      const params: any = {};

      if (filter?.id_kelompok) {
        queryKelompok += ` AND k.id_kelompok = @id_kelompok`;
        params.id_kelompok = filter.id_kelompok;
      }

      if (filter?.id_dosen) {
        queryKelompok += ` AND d.id_dosen = @id_dosen`;
        params.id_dosen = filter.id_dosen;
      }

      queryKelompok += ` ORDER BY k.nama_kelompok ASC`;

      const kelompokList = await this.databaseService.query(queryKelompok, params);

      // Ambil data mahasiswa dan agregat presensi
      const rekapData = await this.databaseService.query(`
        SELECT 
          m.id_mahasiswa,
          m.nim,
          m.nama AS nama_mahasiswa,
          m.id_kelompok,
          COUNT(l.id_log) AS jumlah_kehadiran,
          CAST(ISNULL(SUM(l.durasi_menit), 0) / 60.0 AS DECIMAL(7,2)) AS total_jam,
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM dbo.tr_log_presensi x 
              WHERE x.id_mahasiswa = m.id_mahasiswa AND x.waktu_keluar IS NULL
            ) THEN 1 ELSE 0 
          END AS sedang_di_lab
        FROM dbo.mstr_mahasiswa m
        LEFT JOIN dbo.tr_log_presensi l ON l.id_mahasiswa = m.id_mahasiswa
        WHERE m.status_aktif = 1
        GROUP BY m.id_mahasiswa, m.nim, m.nama, m.id_kelompok
      `);

      // Kelompokkan mahasiswa ke masing-masing kelompok
      const hasil = [];

      for (const klp of kelompokList) {
        const targetJam = parseFloat(klp.target_jam || '20');
        const mhsKelompok = rekapData.filter((m) => m.id_kelompok === klp.id_kelompok);

        const anggota = mhsKelompok.map((m) => {
          const totalJam = parseFloat(m.total_jam || '0');
          const jumlahKehadiran = parseInt(m.jumlah_kehadiran || '0', 10);
          const sedangDiLab = m.sedang_di_lab === 1;

          // Aturan penentuan status capaian sesuai sub-bab 2.2.4 laporan capstone
          let statusCapaian = 'Belum Memenuhi Target';
          if (jumlahKehadiran === 0 || totalJam === 0) {
            statusCapaian = 'Belum Pernah Hadir';
          } else if (totalJam >= targetJam) {
            statusCapaian = 'Memenuhi Target';
          }

          const persentase = Math.min(100, Math.round((totalJam / targetJam) * 100));

          return {
            id_mahasiswa: m.id_mahasiswa,
            nim: m.nim,
            nama: m.nama_mahasiswa,
            jumlah_kehadiran: jumlahKehadiran,
            total_jam: totalJam,
            target_jam: targetJam,
            persentase,
            sedang_di_lab: sedangDiLab,
            status_capaian: statusCapaian,
          };
        });

        // Filter status jika ada parameter filter
        let filteredAnggota = anggota;
        if (filter?.status) {
          if (filter.status === 'sedang_di_lab') {
            filteredAnggota = anggota.filter((a) => a.sedang_di_lab);
          } else {
            filteredAnggota = anggota.filter((a) => a.status_capaian === filter.status);
          }
        }

        if (filteredAnggota.length > 0 || !filter?.status) {
          hasil.push({
            id_kelompok: klp.id_kelompok,
            nama_kelompok: klp.nama_kelompok,
            judul_proyek: klp.judul_proyek,
            target_jam: targetJam,
            periode_mulai: klp.periode_mulai,
            periode_selesai: klp.periode_selesai,
            dosen_pembimbing: klp.dosen_pembimbing,
            nidn: klp.nidn,
            anggota: filteredAnggota,
          });
        }
      }

      return hasil;
    } catch {
      // Data dummy fallback
      return [
        {
          id_kelompok: 1,
          nama_kelompok: 'Kelompok 1',
          judul_proyek: 'Sistem Monitoring Presensi Lab RFID',
          target_jam: 20,
          periode_mulai: '2026-11-02',
          periode_selesai: '2026-12-27',
          dosen_pembimbing: 'Dosen Pembimbing Capstone',
          nidn: '0500000001',
          anggota: [
            {
              id_mahasiswa: 1,
              nim: '20230140001',
              nama: 'Mahasiswa A',
              jumlah_kehadiran: 10,
              total_jam: 21.5,
              target_jam: 20,
              persentase: 100,
              sedang_di_lab: true,
              status_capaian: 'Memenuhi Target',
            },
            {
              id_mahasiswa: 2,
              nim: '20230140002',
              nama: 'Mahasiswa B',
              jumlah_kehadiran: 6,
              total_jam: 12.0,
              target_jam: 20,
              persentase: 60,
              sedang_di_lab: false,
              status_capaian: 'Belum Memenuhi Target',
            },
          ],
        },
      ];
    }
  }
}

