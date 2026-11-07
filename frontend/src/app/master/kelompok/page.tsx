'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { fetchApi } from '@/lib/api';
import { FolderGit2, Plus, Users, Target, Calendar, X } from 'lucide-react';

interface Kelompok {
  id_kelompok: number;
  nama_kelompok: string;
  judul_proyek: string;
  target_jam: number;
  periode_mulai: string;
  periode_selesai: string;
  id_dosen: number;
  dosen_pembimbing: string;
  jumlah_anggota: number;
}

/**
 * Halaman Manajemen Kelompok Capstone:
 * Mengatur data kelompok mahasiswa, penetapan dosen pembimbing, target jam (default 20 jam), dan periode capstone.
 */
export default function MasterKelompokPage() {
  const [kelompokList, setKelompokList] = useState<Kelompok[]>([]);
  const [dosenList, setDosenList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Tambah Kelompok
  const [showModal, setShowModal] = useState(false);
  const [namaKelompok, setNamaKelompok] = useState('');
  const [judulProyek, setJudulProyek] = useState('');
  const [idDosen, setIdDosen] = useState<number>(0);
  const [targetJam, setTargetJam] = useState<number>(20);
  const [periodeMulai, setPeriodeMulai] = useState('2026-11-02');
  const [periodeSelesai, setPeriodeSelesai] = useState('2026-12-27');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Fungsi: Mengambil seluruh daftar kelompok dan dosen pembimbing dari backend.
   */
  const loadData = async () => {
    try {
      setLoading(true);
      const [klp, dsn] = await Promise.all([
        fetchApi<Kelompok[]>('/master/kelompok'),
        fetchApi<any[]>('/master/dosen'),
      ]);
      setKelompokList(klp);
      setDosenList(dsn);
      if (dsn.length > 0) {
        setIdDosen(dsn[0].id_dosen);
      }
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Fungsi: Menyimpan kelompok capstone baru ke database SQL Server.
   */
  const handleSimpanKelompok = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);

    try {
      await fetchApi('/master/kelompok', {
        method: 'POST',
        body: JSON.stringify({
          nama_kelompok: namaKelompok.trim(),
          judul_proyek: judulProyek.trim(),
          id_dosen: Number(idDosen),
          target_jam: Number(targetJam),
          periode_mulai: periodeMulai,
          periode_selesai: periodeSelesai,
        }),
      });

      setShowModal(false);
      setNamaKelompok('');
      setJudulProyek('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan kelompok');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Master Data Kelompok Capstone
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pengaturan kelompok, dosen pembimbing, dan ketentuan jam kehadiran minimum laboratorium
            </p>
          </div>

          <button
            onClick={() => {
              setErrorMsg('');
              setShowModal(true);
            }}
            className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kelompok</span>
          </button>
        </div>

        {/* Grid Kartu Kelompok */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-400">
              Memuat data kelompok...
            </div>
          ) : kelompokList.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Belum ada kelompok capstone yang dibuat.
            </div>
          ) : (
            kelompokList.map((k) => (
              <div
                key={k.id_kelompok}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-lg text-xs font-black uppercase tracking-wider">
                      {k.nama_kelompok}
                    </span>
                    <span className="flex items-center space-x-1 text-xs text-slate-500 font-semibold">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{k.jumlah_anggota || 0} Anggota</span>
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {k.judul_proyek || 'Tanpa Judul Proyek'}
                  </h2>

                  <p className="text-xs text-slate-500 mb-4">
                    Dosen Pembimbing:{' '}
                    <strong className="text-slate-700">{k.dosen_pembimbing}</strong>
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Target className="w-3.5 h-3.5 text-sky-600" />
                      <span>Target Kehadiran</span>
                    </span>
                    <strong className="text-slate-900 font-bold">{k.target_jam} Jam</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Periode Pengerjaan</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {k.periode_mulai} s.d. {k.periode_selesai}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Tambah Kelompok */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Buat Kelompok Capstone</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSimpanKelompok} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Kelompok
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kelompok 1"
                    value={namaKelompok}
                    onChange={(e) => setNamaKelompok(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Judul Proyek Capstone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sistem Monitoring Presensi Lab RFID"
                    value={judulProyek}
                    onChange={(e) => setJudulProyek(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dosen Pembimbing
                  </label>
                  <select
                    value={idDosen}
                    onChange={(e) => setIdDosen(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {dosenList.map((d) => (
                      <option key={d.id_dosen} value={d.id_dosen}>
                        {d.nama} (NIDN: {d.nidn})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Target Jam
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={targetJam}
                      onChange={(e) => setTargetJam(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mulai
                    </label>
                    <input
                      type="date"
                      required
                      value={periodeMulai}
                      onChange={(e) => setPeriodeMulai(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Selesai
                    </label>
                    <input
                      type="date"
                      required
                      value={periodeSelesai}
                      onChange={(e) => setPeriodeSelesai(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 shadow-sm disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Kelompok'}
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

