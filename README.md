# SISTEM MONITORING KEHADIRAN CAPSTONE BERBASIS WEBSITE DENGAN PEMANFAATAN RFID PADA KARTU TANDA MAHASISWA (KTM)
**Program Studi Teknologi Informasi — Fakultas Teknik — Universitas Muhammadiyah Yogyakarta (2026)**

Proyek sistem monitoring presensi laboratorium untuk mahasiswa peserta Capstone Project berbasis penempelan kartu RFID pada Kartu Tanda Mahasiswa (KTM). Dibangun sesuai dengan spesifikasi dan kebutuhan pada dokumen Capstone dan terhubung langsung ke basis data Microsoft SQL Server 2022 (SSMS 22).

---

## 🛠️ Arsitektur & Teknologi

* **Backend:** [NestJS](https://nestjs.com/) (TypeScript, Node.js v22)
  * Modul Autentikasi JWT & Role-Based Access Control (`admin`, `dosen`)
  * Koneksi Basis Data: `mssql` pool driver resmi untuk SQL Server
  * Validasi DTO: `class-validator` & `class-transformer`
* **Frontend:** [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
  * Styling: Tailwind CSS & Lucide Icons
  * Fitur Khusus: Terminal Presensi Kiosk Mode dengan audio feedback dan auto-focus input RFID USB
  * Fitur Ekspor Laporan PDF: Terintegrasi Kop Surat Resmi UMY dan kolom pengesahan dosen
* **Database:** Microsoft SQL Server 2022 (SSMS 22)
  * Nama Database: `Monitoring_Capstone`
  * Skema: `mstr_pengguna`, `mstr_dosen`, `mstr_kelompok`, `mstr_mahasiswa`, `mstr_kartu_rfid`, `tr_log_presensi`

---

## 🚀 Panduan Menjalankan Sistem

### 1. Persiapan Database (SQL Server)
Pastikan database `Monitoring_Capstone` sudah dibuat di SSMS dengan mengeksekusi file:
1. `d:\A.Semester 7\Capstone 2\Database.sql` (Struktur Tabel, Relasi, Constraint, Index)
2. `d:\A.Semester 7\Capstone 2\Data Dummy.sql` (View, Stored Procedure, dan Data Awal)

### 2. Menjalankan Backend (NestJS)
Buka terminal dan masuk ke folder `backend`:
```bash
cd backend
npm run start:dev
```
Backend API akan berjalan di: `http://localhost:3001`
* Dokumentasi / Endpoint Utama:
  * `POST /api/presensi/tap` : Menerima pembacaan UID dari reader RFID
  * `GET  /api/rekap/dashboard` : Statistik ringkasan dashboard
  * `GET  /api/rekap/kelompok` : Rekap jam & status capaian kelompok
  * `POST /api/auth/login` : Login akun admin / dosen
  * `PUT  /api/presensi/koreksi/:id` : Koreksi sesi yang lupa tap keluar

### 3. Menjalankan Frontend (Next.js)
Buka terminal baru dan masuk ke folder `frontend`:
```bash
cd frontend
npm run dev
```
Buka peramban di: `http://localhost:3000`

---

## 💻 Halaman & Fitur Utama

1. **Terminal Presensi (`/terminal`):**
   * Layar utama untuk ditempatkan pada komputer di dekat pintu masuk laboratorium.
   * Dilengkapi jam digital real-time, status standby, dan penangkap otomatis (*auto-focus*) ketukan kartu dari RFID Reader USB.
   * Feedback visual & audio instan:
     * **Hijau (MASUK):** Konfirmasi masuk beserta nama mahasiswa, kelompok, dan target jam.
     * **Biru (KELUAR):** Konfirmasi keluar beserta durasi pengerjaan dan total jam kumulatif.
     * **Oranye (TAP GANDA):** Peringatan jeda (*debounce filter* 10 detik).
     * **Merah (KARTU DITOLAK):** Kartu belum terdaftar di sistem.
2. **Dashboard Monitoring (`/dashboard`):**
   * Kartu metrik: Jumlah Mahasiswa Sedang di Lab, Total Mahasiswa, Memenuhi Target, Progres Berjalan, Belum Pernah Hadir.
   * Tabel mahasiswa yang saat ini aktif di dalam laboratorium.
3. **Laporan Capstone & Ekspor PDF (`/laporan`):**
   * Rekapitulasi per kelompok, nama mahasiswa, total jam kehadiran, target jam, dan persentase progres.
   * Filter status (*Sedang di Lab, Memenuhi Target, Belum Memenuhi Target, Belum Pernah Hadir*).
   * **Tombol "Cetak / Ekspor PDF":** Menghasilkan lembar laporan formal ber-kop UMY lengkap dengan tanda tangan Dosen Pembimbing dan Dosen Penguji.
4. **Riwayat Log & Koreksi Presensi (`/presensi`):**
   * Riwayat pencatatan masuk dan keluar.
   * Fitur admin untuk menutup sesi yang lupa tap keluar dengan catatan alasan koreksi.
5. **Data Master (`/master/*`):**
   * `/master/mahasiswa`: Tambah & kelola data mahasiswa.
   * `/master/kelompok`: Atur kelompok, dosen pembimbing, target jam (default 20), dan tanggal periode.
   * `/master/kartu`: Registrasi kartu RFID baru & fitur penggantian kartu hilang.

---

## 🔑 Kredensial Awal (Default)

* **Username:** `admin`
* **Password:** `admin123` (atau sesuai hash pada `dbo.mstr_pengguna`)
* **Contoh UID Kartu Uji:**
  * `0012345678` (Mahasiswa A)
  * `0098765432` (Mahasiswa B)

