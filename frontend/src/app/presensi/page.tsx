'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { fetchApi, getCurrentUser } from '@/lib/api';
import {
  Clock,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Edit3,
  X,
  Radio,
  Calendar,
} from 'lucide-react';

interface PresensiLog {
  id_log: number;
  id_mahasiswa: number;
  nim: string;
  nama_mahasiswa: string;
  nama_kelompok: string;
  dosen_pembimbing: string;
  waktu_masuk: string;
  waktu_keluar: string | null;
  durasi_menit: number | null;
  metode: string;
  status_sesi: string;
  catatan_koreksi: string | null;
  dikoreksi_oleh_nama: string | null;
}

/**
 * Halaman Riwayat Presensi & Koreksi:
 * Menampilkan catatan seluruh sesi tap kehadiran serta menyediakan formulir koreksi bagi administrator.
 */
export default function PresensiPage() {
  const [logs, setLogs] = useState<PresensiLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // State untuk modal koreksi sesi
  const [selectedLog, setSelectedLog] = useState<PresensiLog | null>(null);
  const [koreksiWaktuKeluar, setKoreksiWaktuKeluar] = useState('');
  const [koreksiAlasan, setKoreksiAlasan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Fungsi: Memuat sesi pengguna saat ini.
   */
  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  /**
   * Fungsi: Mengambil data riwayat log presensi dari backend sesuai filter yang dipilih.
   */
  const loadLogs = async () => {
    try {
      setLoading(true);
      let queryParams = new URLSearchParams();
      if (selectedTanggal) queryParams.append('tanggal', selectedTanggal);
      if (selectedStatus) queryParams.append('status_sesi', selectedStatus);
      if (searchTerm) queryParams.append('search', searchTerm);

      const res = await fetchApi<PresensiLog[]>(`/presensi/logs?${queryParams.toString()}`);
      setLogs(res);
    } catch (err) {
      console.error('Gagal mengambil log presensi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [selectedTanggal, selectedStatus]);

  /**
   * Fungsi: Membuka jendela modal koreksi presensi untuk sesi tertentu.
   */
  const openKoreksiModal = (log: PresensiLog) => {
    setSelectedLog(log);
    setErrorMsg('');
    setKoreksiAlasan('');
    // Nilai default waktu keluar: waktu masuk ditambah 2 jam dalam format datetime-local
    const masuk = new Date(log.waktu_masuk);
    masuk.setHours(masuk.getHours() + 2);
    setKoreksiWaktuKeluar(masuk.toISOString().slice(0, 16));
  };

  /**
   * Fungsi: Mengirimkan data koreksi sesi (waktu keluar & alasan) ke backend.
   */
  const handleSimpanKoreksi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLog) return;
    setErrorMsg('');
    setSubmitting(true);

    try {
      await fetchApi(`/presensi/koreksi/${selectedLog.id_log}`, {
        method: 'PUT',
        body: JSON.stringify({
          waktu_keluar: new Date(koreksiWaktuKeluar).toISOString(),
          catatan_koreksi: koreksiAlasan,
        }),
      });

      setSelectedLog(null);
      loadLogs();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan koreksi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Halaman */}
        <div className="pb-6 border-b border-slate-200 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Riwayat Log Presensi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Daftar seluruh transaksi penempelan kartu RFID mahasiswa dan audit koreksi manual
          </p>
        </div>

        {/* Bar Filter & Pencarian */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari mahasiswa / NIM / kelompok..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadLogs()}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="relative">
            <input
              type="date"
              value={selectedTanggal}
              onChange={(e) => setSelectedTanggal(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Semua Status Sesi</option>
              <option value="terbuka">Sesi Terbuka (Belum Keluar)</option>
              <option value="ditutup">Sesi Ditutup (Selesai)</option>
            </select>
          </div>
        </div>

        {/* Tabel Riwayat Log */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Mahasiswa</th>
                  <th className="py-3 px-4">Kelompok</th>
                  <th className="py-3 px-4">Waktu Masuk</th>
                  <th className="py-3 px-4">Waktu Keluar</th>
                  <th className="py-3 px-4 text-center">Durasi</th>
                  <th className="py-3 px-4 text-center">Metode</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  {currentUser?.peran === 'admin' && (
                    <th className="py-3 px-4 text-right">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Memuat riwayat presensi...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Tidak ada riwayat log yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isTerbuka = !log.waktu_keluar;
                    const durasiJam = log.durasi_menit ? Math.floor(log.durasi_menit / 60) : 0;
                    const durasiMenit = log.durasi_menit ? log.durasi_menit % 60 : 0;
                    const durasiTeks =
                      log.durasi_menit !== null
                        ? durasiJam > 0
                          ? `${durasiJam}j ${durasiMenit}m`
                          : `${durasiMenit} menit`
                        : '-';

                    return (
                      <tr key={log.id_log} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {log.nama_mahasiswa}
                          <span className="block text-xs font-mono text-slate-400 font-normal">
                            {log.nim}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">
                          {log.nama_kelompok}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-700">
                          {new Date(log.waktu_masuk).toLocaleString('id-ID', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-700">
                          {log.waktu_keluar
                            ? new Date(log.waktu_keluar).toLocaleString('id-ID', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })
                            : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800 text-xs">
                          {durasiTeks}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {log.metode}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isTerbuka ? (
                            <span className="inline-flex items-center space-x-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              <Radio className="w-3 h-3 animate-pulse" />
                              <span>Di Lab</span>
                            </span>
                          ) : (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              Selesai
                            </span>
                          )}
                          {log.catatan_koreksi && (
                            <span
                              title={`Dikoreksi oleh ${log.dikoreksi_oleh_nama}: ${log.catatan_koreksi}`}
                              className="block text-[10px] text-amber-600 font-semibold mt-0.5 cursor-help"
                            >
                              (Dikoreksi)
                            </span>
                          )}
                        </td>
                        {currentUser?.peran === 'admin' && (
                          <td className="py-3.5 px-4 text-right">
                            {isTerbuka ? (
                              <button
                                onClick={() => openKoreksiModal(log)}
                                className="inline-flex items-center space-x-1 text-xs font-bold text-sky-600 hover:text-sky-800 hover:bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-200 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Koreksi</span>
                              </button>
                            ) : (
                              <span className="text-xs text-slate-300">-</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL KOREKSI PRESENSI */}
        {selectedLog && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Koreksi Sesi Presensi</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSimpanKoreksi} className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                  <div>
                    Mahasiswa:{' '}
                    <strong className="text-slate-800">{selectedLog.nama_mahasiswa}</strong> (
                    {selectedLog.nim})
                  </div>
                  <div>
                    Waktu Masuk:{' '}
                    <strong className="text-slate-800">
                      {new Date(selectedLog.waktu_masuk).toLocaleString('id-ID')}
                    </strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Waktu Keluar
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={koreksiWaktuKeluar}
                    onChange={(e) => setKoreksiWaktuKeluar(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alasan Koreksi
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Contoh: Mahasiswa lupa tap keluar saat pulang jam 17:30..."
                    value={koreksiAlasan}
                    onChange={(e) => setKoreksiAlasan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLog(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Koreksi'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

