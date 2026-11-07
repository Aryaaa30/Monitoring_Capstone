'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { fetchApi } from '@/lib/api';
import { Users, Plus, Search, CheckCircle2, XCircle, X } from 'lucide-react';

interface Mahasiswa {
  id_mahasiswa: number;
  nim: string;
  nama: string;
  status_aktif: boolean;
  id_kelompok: number;
  nama_kelompok: string;
  id_kartu: number | null;
  uid_kartu: string | null;
  status_kartu: string | null;
}

/**
 * Halaman Manajemen Data Mahasiswa:
 * Mengelola daftar mahasiswa peserta capstone, pengelompokan, serta status kartu RFID.
 */
export default function MasterMahasiswaPage() {
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [kelompokList, setKelompokList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Tambah Mahasiswa
  const [showAddModal, setShowAddModal] = useState(false);
  const [nimInput, setNimInput] = useState('');
  const [namaInput, setNamaInput] = useState('');
  const [kelompokInput, setKelompokInput] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Fungsi: Memuat seluruh data mahasiswa dan kelompok dari backend.
   */
  const loadData = async () => {
    try {
      setLoading(true);
      const [mhs, klp] = await Promise.all([
        fetchApi<Mahasiswa[]>('/master/mahasiswa'),
        fetchApi<any[]>('/master/kelompok'),
      ]);
      setMahasiswaList(mhs);
      setKelompokList(klp);
      if (klp.length > 0) {
        setKelompokInput(klp[0].id_kelompok);
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
   * Fungsi: Menyimpan data mahasiswa baru ke database.
   */
  const handleSimpanMahasiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);

    try {
      await fetchApi('/master/mahasiswa', {
        method: 'POST',
        body: JSON.stringify({
          nim: nimInput.trim(),
          nama: namaInput.trim(),
          id_kelompok: Number(kelompokInput),
        }),
      });

      setShowAddModal(false);
      setNimInput('');
      setNamaInput('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const filtered = mahasiswaList.filter(
    (m) =>
      m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.nama_kelompok && m.nama_kelompok.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Master Data Mahasiswa
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Data peserta Capstone Project yang terdaftar di laboratorium
            </p>
          </div>

          <button
            onClick={() => {
              setErrorMsg('');
              setShowAddModal(true);
            }}
            className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mahasiswa</span>
          </button>
        </div>

        {/* Bar Pencarian */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari mahasiswa / NIM / kelompok..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Tabel Mahasiswa */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">No.</th>
                  <th className="py-3 px-4">NIM</th>
                  <th className="py-3 px-4">Nama Mahasiswa</th>
                  <th className="py-3 px-4">Kelompok Capstone</th>
                  <th className="py-3 px-4 text-center">Kartu RFID (UID)</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Memuat data mahasiswa...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Belum ada data mahasiswa.
                    </td>
                  </tr>
                ) : (
                  filtered.map((m, idx) => (
                    <tr key={m.id_mahasiswa} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                        {m.nim}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{m.nama}</td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {m.nama_kelompok || <span className="text-slate-400 italic">Belum ada kelompok</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {m.uid_kartu ? (
                          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                            {m.uid_kartu}
                          </span>
                        ) : (
                          <span className="text-xs text-rose-500 font-medium italic">
                            Belum terdaftar
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {m.status_aktif ? (
                          <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" />
                            <span>Nonaktif</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah Mahasiswa */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Tambah Mahasiswa Baru</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSimpanMahasiswa} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    NIM Mahasiswa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 20220140114"
                    value={nimInput}
                    onChange={(e) => setNimInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Arya Anugrah"
                    value={namaInput}
                    onChange={(e) => setNamaInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kelompok Capstone
                  </label>
                  <select
                    value={kelompokInput}
                    onChange={(e) => setKelompokInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {kelompokList.map((k) => (
                      <option key={k.id_kelompok} value={k.id_kelompok}>
                        {k.nama_kelompok} — {k.dosen_pembimbing}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 shadow-sm disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Mahasiswa'}
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

