'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { fetchApi } from '@/lib/api';
import { CreditCard, Plus, RefreshCw, CheckCircle2, XCircle, Search, X } from 'lucide-react';

interface KartuRFID {
  id_kartu: number;
  uid_kartu: string;
  status: 'aktif' | 'nonaktif';
  tanggal_registrasi: string;
  id_mahasiswa: number;
  nim: string;
  nama_mahasiswa: string;
  nama_kelompok: string;
}

/**
 * Halaman Manajemen Kartu RFID:
 * Menangani registrasi awal UID kartu KTM ke mahasiswa serta prosedur penggantian kartu hilang/rusak.
 */
export default function MasterKartuPage() {
  const [kartuList, setKartuList] = useState<KartuRFID[]>([]);
  const [mahasiswaList, setMahasiswaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Registrasi Baru
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regMahasiswaId, setRegMahasiswaId] = useState<number>(0);
  const [regUid, setRegUid] = useState('');

  // Modal Ganti Kartu Hilang
  const [showGantiModal, setShowGantiModal] = useState(false);
  const [gantiMahasiswaId, setGantiMahasiswaId] = useState<number>(0);
  const [gantiUidBaru, setGantiUidBaru] = useState('');
  const [gantiAlasan, setGantiAlasan] = useState('Kartu KTM hilang');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  /**
   * Fungsi: Memuat seluruh data kartu RFID dan daftar mahasiswa dari backend.
   */
  const loadData = async () => {
    try {
      setLoading(true);
      const [kartu, mhs] = await Promise.all([
        fetchApi<KartuRFID[]>('/master/kartu'),
        fetchApi<any[]>('/master/mahasiswa'),
      ]);
      setKartuList(kartu);
      setMahasiswaList(mhs);
      if (mhs.length > 0) {
        setRegMahasiswaId(mhs[0].id_mahasiswa);
        setGantiMahasiswaId(mhs[0].id_mahasiswa);
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
   * Fungsi: Mengirimkan registrasi kartu RFID baru untuk mahasiswa yang belum memiliki kartu aktif.
   */
  const handleRegisterKartu = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);

    try {
      const res = await fetchApi('/master/kartu/register', {
        method: 'POST',
        body: JSON.stringify({
          id_mahasiswa: Number(regMahasiswaId),
          uid_kartu: regUid.trim(),
        }),
      });

      setSuccessMsg(res.message);
      setShowRegisterModal(false);
      setRegUid('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal meregistrasi kartu');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Fungsi: Memproses penggantian kartu (menonaktifkan kartu lama dan mengaktifkan UID baru).
   */
  const handleGantiKartu = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);

    try {
      const res = await fetchApi('/master/kartu/ganti', {
        method: 'POST',
        body: JSON.stringify({
          id_mahasiswa: Number(gantiMahasiswaId),
          uid_kartu_baru: gantiUidBaru.trim(),
          alasan: gantiAlasan,
        }),
      });

      setSuccessMsg(res.message);
      setShowGantiModal(false);
      setGantiUidBaru('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengganti kartu');
    } finally {
      setSaving(false);
    }
  };

  const filtered = kartuList.filter(
    (k) =>
      k.uid_kartu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.nama_mahasiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.nim.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen Kartu RFID (KTM)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pengaitan nomor UID chip RFID dengan mahasiswa dan penanganan kartu hilang
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setErrorMsg('');
                setShowGantiModal(true);
              }}
              className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Ganti Kartu Hilang</span>
            </button>

            <button
              onClick={() => {
                setErrorMsg('');
                setShowRegisterModal(true);
              }}
              className="inline-flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Registrasi Kartu Baru</span>
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Bar Pencarian */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari UID / Mahasiswa / NIM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Tabel Kartu RFID */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">UID Kartu</th>
                  <th className="py-3 px-4">Mahasiswa Pemilik</th>
                  <th className="py-3 px-4">Kelompok</th>
                  <th className="py-3 px-4">Tanggal Registrasi</th>
                  <th className="py-3 px-4 text-right">Status Kartu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Memuat daftar kartu RFID...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Belum ada kartu RFID yang terdaftar.
                    </td>
                  </tr>
                ) : (
                  filtered.map((k) => (
                    <tr key={k.id_kartu} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                          {k.uid_kartu}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {k.nama_mahasiswa}
                        <span className="block text-xs font-mono text-slate-400 font-normal">
                          {k.nim}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        {k.nama_kelompok || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                        {new Date(k.tanggal_registrasi).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {k.status === 'aktif' ? (
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

        {/* Modal Registrasi Kartu Baru */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Registrasi Kartu RFID Baru</h3>
                <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleRegisterKartu} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pilih Mahasiswa
                  </label>
                  <select
                    value={regMahasiswaId}
                    onChange={(e) => setRegMahasiswaId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {mahasiswaList.map((m) => (
                      <option key={m.id_mahasiswa} value={m.id_mahasiswa}>
                        {m.nim} — {m.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nomor UID Kartu RFID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tempelkan kartu ke reader atau ketik UID..."
                    value={regUid}
                    onChange={(e) => setRegUid(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tips: Klik kotak input ini lalu tempelkan KTM ke reader USB.
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 shadow-sm disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan...' : 'Registrasi Kartu'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Ganti Kartu Hilang */}
        {showGantiModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Ganti Kartu Hilang / Rusak</h3>
                <button onClick={() => setShowGantiModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleGantiKartu} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mahasiswa Pemilik
                  </label>
                  <select
                    value={gantiMahasiswaId}
                    onChange={(e) => setGantiMahasiswaId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {mahasiswaList.map((m) => (
                      <option key={m.id_mahasiswa} value={m.id_mahasiswa}>
                        {m.nim} — {m.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    UID Kartu Baru
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tempelkan kartu pengganti..."
                    value={gantiUidBaru}
                    onChange={(e) => setGantiUidBaru(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alasan Penggantian
                  </label>
                  <input
                    type="text"
                    value={gantiAlasan}
                    onChange={(e) => setGantiAlasan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                  Perhatian: Kartu lama yang sebelumnya aktif akan otomatis dinonaktifkan oleh sistem.
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGantiModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 shadow-sm disabled:opacity-50"
                  >
                    {saving ? 'Memproses...' : 'Nonaktifkan Lama & Pasang Baru'}
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

