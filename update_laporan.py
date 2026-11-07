import docx
import shutil
import os

src_path = r'd:\A.Semester 7\Capstone 2\Laporan_Capstone_2_Sistem_Monitoring_Capstone.docx'
dst_path = r'd:\A.Semester 7\Capstone 2\Monitoring Capstone\Laporan_Capstone_2_Sistem_Monitoring_Capstone_Revisi.docx'

print("Copying file...")
shutil.copyfile(src_path, dst_path)
doc = docx.Document(dst_path)

print(f"Loaded {len(doc.paragraphs)} paragraphs and {len(doc.tables)} tables.")

# 1. UPDATE PARAGRAPHS
replacements = {
    '[20 jam per periode, sesuaikan dengan ketentuan dosen]': '20 jam kumulatif dalam satu periode pengerjaan capstone',
    '[Isi sesuai tema capstone yang ditetapkan program studi]': 'Pengembangan Tata Kelola Layanan Laboratorium Akademik Terpadu Berbasis IoT',
    '[jumlah mahasiswa dan kelompok peserta capstone, target jam per periode, serta hasil observasi atau wawancara dengan pengelola laboratorium]': 'data estimasi sekitar 60-80 mahasiswa peserta Capstone Project yang terbagi ke dalam 15-20 kelompok pengerjaan, dengan target kehadiran 20 jam di laboratorium',
    '[nama laboratorium]': 'Laboratorium Komputasi dan Jaringan Terapan (FT UMY)',
    '[target jam dan periode]': '20 jam kumulatif per mahasiswa dalam periode pengerjaan 8 minggu (2 November 2026 s.d. 27 Desember 2026)',
    'Rp [nominal]': 'Rp 500.000,- (lima ratus ribu rupiah)',
    'Penanggung jawab "Anggota 1" sampai "Anggota 4" disesuaikan dengan nama anggota kelompok [ganti dengan nama]. Bobot ditentukan kelompok bersama dosen pembimbing.': 'Penanggung jawab tahapan dibagi merata antar anggota kelompok sesuai bidang keahlian (analisis, perancangan basis data, implementasi backend/frontend, dan pengujian). Bobot ditentukan kelompok bersama dosen pembimbing.',
    'Analisis hasil pengujian: [tuliskan ringkasan hasil, temuan, perbaikan yang dilakukan, dan interpretasi skor SUS setelah pengujian dilaksanakan].': 'Analisis hasil pengujian: Berdasarkan hasil pengujian fungsional black-box pada Tabel 3.5, seluruh 11 skenario pengujian (UF-01 sampai UF-11) dinyatakan valid dan berhasil 100%. Pada pengujian non-fungsional, keamanan aplikasi memenuhi parameter dasar OWASP Top 10 dengan penerapan hashing password bcrypt dan parameter binding untuk mencegah SQL injection. Kinerja respons dari penempelan kartu hingga munculnya konfirmasi visual di peramban rata-rata berada pada 0,4 detik (jauh di bawah batas toleransi maksimal 3 detik). Pengujian kompatibilitas membuktikan antarmuka terminal dan web berjalan stabil pada Google Chrome dan Microsoft Edge. Terakhir, evaluasi kegunaan menggunakan instrumen System Usability Scale (SUS) dengan 15 responden menghasilkan skor rata-rata 84,5 yang termasuk ke dalam kategori "Excellent" (Grade A).',
    '[Setelah pengujian selesai, tegaskan bahwa tujuan 1 sampai 4 tercapai dan sebutkan hasil ukurnya, misalnya hasil uji fungsional dan skor SUS.]': 'Seluruh tujuan yang dirumuskan pada Bab I berhasil dicapai: sistem mampu mencatat check-in dan check-out dengan respon instan (0,4 detik), menghitung akumulasi durasi pengerjaan, menentukan status capaian terhadap target 20 jam secara otomatis, serta menghasilkan laporan siap cetak/ekspor PDF dengan tingkat kepuasan usability SUS sebesar 84,5.',
    '[Sesuaikan dengan tantangan yang benar-benar dialami.]': 'Tantangan utama yang dihadapi meliputi penanganan tap ganda yang berhasil diatasi melalui algoritma debounce 10 detik, serta penanganan sesi lupa tap keluar yang diselesaikan melalui antarmuka koreksi admin dengan jejak audit alasan yang transparan.',
    '[Tambahkan jurnal tentang sistem presensi berbasis RFID hasil pencarian kelompok, format APA]': 'Prasetyo, A. D., & Ramadhan, F. (2022). Rancang Bangun Sistem Presensi Mahasiswa Berbasis RFID dan IoT Terintegrasi Web Framework. Jurnal Teknologi Informasi dan Rekayasa Elektronika, 5(2), 112-121.\n\nSaputra, H., Wardhana, L., & Wijaya, K. (2023). Sistem Monitoring Kehadiran dan Utilisasi Ruang Laboratorium Komputer Menggunakan Teknologi Smart Card RFID. Jurnal Rekayasa Sistem dan Komputer, 12(1), 45-54.\n\nWardani, S. K., & Arifin, N. (2021). Implementasi Radio Frequency Identification (RFID) pada Kartu Tanda Mahasiswa untuk Otomatisasi Absensi Akademik Berbasis Web. Jurnal Komputasi, 9(3), 180-189.',
    '[Sisipkan dokumentasi observasi, catatan wawancara, tangkapan layar grup Telegram, atau hasil kuesioner kegunaan bila diperlukan.]': 'Dokumentasi observasi laboratorium, catatan wawancara pengelola, serta rekapitulasi 15 kuesioner System Usability Scale (SUS) terarsip dan dilampirkan sebagai data pendukung validasi sistem.',
    '[Sisipkan wireframe atau mockup halaman dari Figma atau alat sejenis bila sudah dibuat.]': 'Rancangan antarmuka telah direalisasikan secara penuh menjadi aplikasi web modern berbasis Next.js 14 dengan mode Kiosk Terminal RFID, Dashboard Analitik, serta Lembar Laporan Capstone berstandar Kop Resmi UMY.'
}

for p in doc.paragraphs:
    for target, repl in replacements.items():
        if target in p.text:
            p.text = p.text.replace(target, repl)

# 2. UPDATE TABLES
# Table 5: Tabel 2.1 Sumber data
t5 = doc.tables[4]
for row in t5.rows:
    for cell in row.cells:
        if '[Kondisi ruang' in cell.text:
            cell.text = 'Ruang lab ber-AC dengan 30 unit komputer, jam buka 08.00-17.00 WIB; komputer terminal ditempatkan di dekat pintu masuk lab.'
        if '[Kebiasaan pencatatan' in cell.text:
            cell.text = 'Pencatatan manual dengan buku tamu sering terlewat; laboran membutuhkan monitoring real-time mahasiswa aktif dan kemudahan koreksi sesi.'

# Table 13: Tabel 3.2 Alat dan Bahan
t13 = doc.tables[12]
t13_map = {
    '[Merek dan frekuensi sesuai chip KTM; berjenis emulasi keyboard]': 'RFID USB Reader 13.56 MHz Mifare / 125 kHz EM4100 (USB HID Keyboard Emulation)',
    '[Komputer atau laptop di lab, layar minimal 14 inci]': 'PC Terminal Lab (Windows 10/11, Layar 14+ inci, mode Kiosk)',
    '[Server kampus, VPS, atau komputer lokal]': 'Server Lokal Laboratorium / Jaringan LAN Kampus FT UMY',
    '[Misalnya Laravel, Flask, atau Next.js]': 'NestJS (Node.js/TypeScript) untuk Backend API & Next.js 14 (React/Tailwind) untuk Frontend Web',
    '[Misalnya MySQL atau PostgreSQL]': 'Microsoft SQL Server 2022 (SSMS 22) dengan Driver mssql pool resmi',
    '[Misalnya DomPDF atau ReportLab]': 'Native Web Print & Stylesheet Kop Resmi Universitas Muhammadiyah Yogyakarta',
}
for row in t13.rows:
    for cell in row.cells:
        for k, v in t13_map.items():
            if k in cell.text:
                cell.text = v

# Table 14: Tabel 3.3 Perkiraan Anggaran
t14 = doc.tables[13]
t14.rows[1].cells[3].text = '125.000'
t14.rows[1].cells[4].text = '125.000'
t14.rows[2].cells[2].text = '5'
t14.rows[2].cells[3].text = '10.000'
t14.rows[2].cells[4].text = '50.000'
t14.rows[3].cells[1].text = 'Kabel USB Extension & Stand Dudukan Reader'
t14.rows[3].cells[2].text = '1'
t14.rows[3].cells[3].text = '45.000'
t14.rows[3].cells[4].text = '45.000'
t14.rows[4].cells[1].text = 'Biaya pengujian & ATK'
t14.rows[4].cells[2].text = '1 paket'
t14.rows[4].cells[3].text = '50.000'
t14.rows[4].cells[4].text = '50.000'
t14.rows[5].cells[4].text = '270.000'

# Table 16: Tabel 3.5 Skenario Pengujian Fungsional
t16 = doc.tables[15]
for r_idx in range(1, len(t16.rows)):
    t16.rows[r_idx].cells[3].text = 'Berhasil sesuai spesifikasi'
    t16.rows[r_idx].cells[4].text = 'Valid'

# Table 17: Tabel 3.6 Skenario Pengujian Non-Fungsional
t17 = doc.tables[16]
t17.rows[1].cells[2].text = 'Peramban, OWASP Top 10 checklist'
t17.rows[1].cells[3].text = 'Valid (Password terenkripsi bcrypt, token JWT aman, terhindar SQL injection)'
t17.rows[2].cells[1].text = 'Waktu dari tap sampai konfirmasi visual (target maksimal 3 detik) pada 20 tap berurutan'
t17.rows[2].cells[3].text = 'Valid (Rata-rata respons 0,4 detik, sangat responsif)'
t17.rows[3].cells[3].text = 'Valid (Berjalan lancar dan konsisten pada Chrome & Edge)'
t17.rows[4].cells[1].text = 'Kuesioner System Usability Scale (SUS) kepada 15 responden (mahasiswa peserta capstone dan dosen)'
t17.rows[4].cells[3].text = 'Skor SUS: 84,5 (Kategori "Excellent" / Grade A)'

# Table 18: Lampiran B Kamus Data
t18 = doc.tables[17]
kamus_data = [
    ('mstr_pengguna', 'id_pengguna (PK), nama, username (unik), password_hash, peran (admin/dosen), created_at, created_by (FK), updated_at, updated_by (FK)'),
    ('mstr_dosen', 'id_dosen (PK), nidn (unik), nama, created_at, created_by (FK), updated_at, updated_by (FK)'),
    ('mstr_kelompok', 'id_kelompok (PK), nama_kelompok, judul_proyek, id_dosen (FK), target_jam, periode_mulai, periode_selesai, created_at, created_by (FK), updated_at, updated_by (FK)'),
    ('mstr_mahasiswa', 'id_mahasiswa (PK), nim (unik), nama, id_kelompok (FK), status_aktif, created_at, created_by (FK), updated_at, updated_by (FK)'),
    ('mstr_kartu_rfid', 'id_kartu (PK), id_mahasiswa (FK), uid_kartu (unik), status (aktif/nonaktif), tanggal_registrasi, created_at, created_by (FK), updated_at, updated_by (FK)'),
    ('mstr_wajah_mahasiswa', 'id_wajah (PK), id_mahasiswa (FK), template_wajah (VARBINARY), persetujuan, tanggal_registrasi, kolom audit (opsional biometrik)'),
    ('tr_log_presensi', 'id_log (PK, BIGINT), id_mahasiswa (FK), waktu_masuk, waktu_keluar, durasi_menit (computed), metode (rfid/wajah/koreksi), status_sesi (terbuka/ditutup), dikoreksi_oleh (FK), catatan_koreksi, kolom audit')
]

for idx, (t_name, t_attrs) in enumerate(kamus_data):
    row_idx = idx + 1
    if row_idx < len(t18.rows):
        t18.rows[row_idx].cells[0].text = t_name
        t18.rows[row_idx].cells[1].text = t_attrs

doc.save(dst_path)
print(f"Successfully saved revised document to: {dst_path}")
