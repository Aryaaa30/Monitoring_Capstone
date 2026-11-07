'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { fetchApi } from '@/lib/api';
import {
  FileText,
  Printer,
  Filter,
  CheckCircle2,
  Clock,
  Radio,
  AlertCircle,
  Users,
  Search,
} from 'lucide-react';

interface AnggotaRekap {
  id_mahasiswa: number;
  nim: string;
  nama: string;
  jumlah_kehadiran: number;
  total_jam: number;
  target_jam: number;
  persentase: number;
  sedang_di_lab: boolean;
  status_capaian: string;
}

interface KelompokRekap {
  id_kelompok: number;
  nama_kelompok: string;
  judul_proyek: string;
  target_jam: number;
  periode_mulai: string;
  periode_selesai: string;
  dosen_pembimbing: string;
  nidn: string;
  anggota: AnggotaRekap[];
}

/**
 * Halaman Laporan Capstone & Ekspor PDF:
 * Menyajikan rekapitulasi jam kerja lab per kelompok dan menyediakan fitur cetak PDF resmi untuk dosen penguji.
 */
export default function LaporanPage() {
  const [data, setData] = useState<KelompokRekap[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  /**
   * Fungsi: Memuat data rekapitulasi presensi dari backend sesuai filter status yang dipilih.
   */
  const loadRekapData = async () => {
    try {
      setLoading(true);
      let url = '/rekap/kelompok';
      if (filterStatus) {
        url += `?status=${filterStatus}`;
      }
      const res = await fetchApi<KelompokRekap[]>(url);
      setData(res);
    } catch (err) {
      console.error('Gagal memuat rekap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRekapData();
  }, [filterStatus]);

  /**
   * Fungsi: Membuka dialog cetak peramban untuk mengekspor dokumen laporan ke format PDF.
   */
  const handlePrint = () => {
    window.print();
  };

  // Filter pencarian berdasarkan nama mahasiswa, NIM, atau nama kelompok
  const filteredData = data.map((klp) => {
    const matchKelompok = klp.nama_kelompok.toLowerCase().includes(searchTerm.toLowerCase());
    const filteredAnggota = klp.anggota.filter(
      (m) =>
        matchKelompok ||
        m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nim.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return {
      ...klp,
      anggota: filteredAnggota,
    };
  }).filter((klp) => klp.anggota.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* KOP RESMI LAPORAN (Khusus Tampil Saat Dicetak / Ekspor PDF) */}
        <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-black">
            UNIVERSITAS MUHAMMADIYAH YOGYAKARTA
          </h2>
          <h3 className="text-base font-semibold uppercase text-black">
            FAKULTAS TEKNIK — PROGRAM STUDI TEKNOLOGI INFORMASI
          </h3>
          <p className="text-xs text-black mt-1">
            Gedung Siti Walidah, Kampus Terpadu UMY, Jl. Brawijaya, Tamantirto, Kasihan, Bantul, D.I. Yogyakarta
          </p>
          <div className="mt-4 pt-2 border-t border-black">
            <h1 className="text-lg font-black uppercase text-black">
              LAPORAN MONITORING KEHADIRAN LABORATORIUM CAPSTONE PROJECT
            </h1>
            <p className="text-xs text-black mt-0.5">
              Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Header Layar Interaktif & Tombol Ekspor PDF (Disembunyikan Saat Print) */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Laporan Kehadiran Capstone
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Rekapitulasi jam pengerjaan di lab per kelompok untuk bahan penilaian Dosen Penguji
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Ekspor PDF</span>
            </button>
          </div>
        </div>

        {/* Filter & Bar Pencarian (Disembunyikan Saat Print) */}
        <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Input Pencarian */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari mahasiswa, NIM, atau kelompok..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filter Status Capaian */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status:
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Semua Status</option>
              <option value="sedang_di_lab">Sedang di Lab</option>
              <option value="Memenuhi Target">Memenuhi Target</option>
              <option value="Belum Memenuhi Target">Belum Memenuhi Target</option>
              <option value="Belum Pernah Hadir">Belum Pernah Hadir</option>
            </select>
          </div>
        </div>

        {/* Konten Laporan per Kelompok */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium text-sm">
            Memuat data laporan capstone...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-sm">
            Tidak ada data yang cocok dengan kriteria pencarian atau filter.
          </div>
        ) : (
          <div className="space-y-8">
            {filteredData.map((klp) => (
              <div
                key={klp.id_kelompok}
                className="bg-white border border-slate-200 print:border-black rounded-2xl p-6 shadow-sm break-inside-avoid"
              >
                {/* Header Informasi Kelompok */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 print:border-black mb-4 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-sky-100 text-sky-800 print:bg-slate-200 print:text-black rounded-lg text-xs font-black uppercase tracking-wider">
                        {klp.nama_kelompok}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 print:text-black">
                        {klp.judul_proyek || 'Tanpa Judul Proyek'}
                      </h2>
                    </div>
                  </div>

                  <div className="text-left md:text-right text-xs text-slate-600 print:text-black">
                    <div>
                      Dosen Pembimbing:{' '}
                      <strong className="text-slate-800 print:text-black">
                        {klp.dosen_pembimbing}
                      </strong>{' '}
                      (NIDN: {klp.nidn || '-'})
                    </div>
                    <div className="text-slate-400 print:text-black mt-0.5">
                      Target:{' '}
                      <strong className="text-sky-700 print:text-black">
                        {klp.target_jam} Jam
                      </strong>{' '}
                      • Periode: {klp.periode_mulai} s.d. {klp.periode_selesai}
                    </div>
                  </div>
                </div>

                {/* Tabel Anggota dan Capaian Jam */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm print:text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 print:border-black text-xs font-bold text-slate-400 print:text-black uppercase">
                        <th className="py-2.5">No.</th>
                        <th className="py-2.5">NIM</th>
                        <th className="py-2.5">Nama Mahasiswa</th>
                        <th className="py-2.5 text-center">Jumlah Kehadiran</th>
                        <th className="py-2.5 text-center">Akumulasi Jam</th>
                        <th className="py-2.5 text-center no-print">Progres Target</th>
                        <th className="py-2.5 text-right">Status Capaian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                      {klp.anggota.map((m, idx) => (
                        <tr key={m.id_mahasiswa} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 text-slate-400 print:text-black">{idx + 1}</td>
                          <td className="py-3 font-mono font-semibold text-slate-700 print:text-black">
                            {m.nim}
                          </td>
                          <td className="py-3 font-bold text-slate-900 print:text-black">
                            {m.nama}
                            {m.sedang_di_lab && (
                              <span className="ml-2 inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 print:hidden">
                                <Radio className="w-3 h-3 animate-pulse" />
                                <span>Di Lab</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-center text-slate-700 print:text-black">
                            {m.jumlah_kehadiran} Sesi
                          </td>
                          <td className="py-3 text-center font-bold text-slate-900 print:text-black">
                            {m.total_jam} Jam
                          </td>
                          <td className="py-3 text-center no-print w-48">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    m.persentase >= 100 ? 'bg-emerald-500' : 'bg-sky-500'
                                  }`}
                                  style={{ width: `${m.persentase}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono font-semibold text-slate-600 w-9 text-right">
                                {m.persentase}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <span
                              className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                                m.status_capaian === 'Memenuhi Target'
                                  ? 'bg-emerald-100 text-emerald-800 print:border print:border-black'
                                  : m.status_capaian === 'Belum Pernah Hadir'
                                  ? 'bg-rose-100 text-rose-800 print:border print:border-black'
                                  : 'bg-amber-100 text-amber-800 print:border print:border-black'
                              }`}
                            >
                              {m.status_capaian}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KOLOM TANDA TANGAN RESMI (Khusus Tampil Saat Dicetak / Ekspor PDF) */}
        <div className="hidden print:grid grid-cols-2 gap-12 mt-12 pt-8 text-center text-xs text-black break-inside-avoid">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold">Dosen Pembimbing Capstone</p>
            <div className="h-20" />
            <p className="font-bold underline">( .................................................... )</p>
            <p>NIDN: ...........................................</p>
          </div>

          <div>
            <p>Yogyakarta, ....................................</p>
            <p className="font-bold">Dosen Penguji Capstone</p>
            <div className="h-20" />
            <p className="font-bold underline">( .................................................... )</p>
            <p>NIDN: ...........................................</p>
          </div>
        </div>
      </main>
    </div>
  );
}

