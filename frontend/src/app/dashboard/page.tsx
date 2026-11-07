'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
  Users,
  Radio,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderGit2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  total_mahasiswa: number;
  sedang_di_lab: number;
  belum_pernah_hadir: number;
  memenuhi_target: number;
  belum_memenuhi_target: number;
  aktivitas_terbaru: any[];
}

/**
 * Halaman Dashboard: Menyajikan ringkasan metrik statistik kehadiran dan aktivitas lab terkini.
 */
export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fungsi: Mengambil data ringkasan dashboard dan daftar sesi aktif dari backend.
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await fetchApi<DashboardStats>('/rekap/dashboard');
      setStats(data);

      const active = await fetchApi<any[]>('/presensi/aktif');
      setActiveSessions(active);
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('Token')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 15000); // Polling setiap 15 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Judul & Aksi Cepat */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Monitoring Lab
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pemantauan aktivitas dan kepatuhan jam kehadiran mahasiswa Capstone Project
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/laporan"
              className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              <span>Lihat Laporan Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Baris Kartu Statistik Metrik Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* 1. Sedang di Lab (Waktu Nyata) */}
          <div className="bg-white border-2 border-emerald-500/40 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Sedang di Lab
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.sedang_di_lab || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Mahasiswa aktif saat ini</p>
          </div>

          {/* 2. Total Mahasiswa Capstone */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Mahasiswa
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.total_mahasiswa || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Peserta capstone aktif</p>
          </div>

          {/* 3. Memenuhi Target */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Memenuhi Target
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.memenuhi_target || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Akumulasi ≥ target jam</p>
          </div>

          {/* 4. Belum Memenuhi Target */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Progres Berjalan
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.belum_memenuhi_target || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Belum capai target jam</p>
          </div>

          {/* 5. Belum Pernah Hadir */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                Belum Pernah Hadir
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.belum_pernah_hadir || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Total jam masih 0</p>
          </div>
        </div>

        {/* Bagian Bawah: 2 Kolom (Sesi Aktif di Lab & Aktivitas Terbaru) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri: Mahasiswa yang Sedang di Lab Saat Ini (7 Kolom) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-lg font-bold text-slate-900">
                  Mahasiswa Sedang di Laboratorium
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {activeSessions.length} Orang
              </span>
            </div>

            {activeSessions.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                Saat ini belum ada mahasiswa yang berada di laboratorium.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                      <th className="pb-3">Mahasiswa</th>
                      <th className="pb-3">Kelompok</th>
                      <th className="pb-3">Waktu Masuk</th>
                      <th className="pb-3 text-right">Durasi Berjalan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeSessions.map((s) => (
                      <tr key={s.id_log} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-medium text-slate-900">
                          {s.nama_mahasiswa}
                          <span className="block text-xs font-mono text-slate-400 font-normal">
                            {s.nim}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">{s.nama_kelompok}</td>
                        <td className="py-3 font-mono text-xs text-slate-500">
                          {new Date(s.waktu_masuk).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 text-right font-semibold text-emerald-600">
                          {s.berjalan_menit} menit
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Aktivitas Tap Terbaru (5 Kolom) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-bold text-slate-900">Aktivitas Terbaru</h2>
              </div>
              <Link href="/presensi" className="text-xs font-bold text-sky-600 hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              {!stats?.aktivitas_terbaru || stats.aktivitas_terbaru.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Belum ada log aktivitas.
                </div>
              ) : (
                stats.aktivitas_terbaru.map((log) => {
                  const isMasuk = !log.waktu_keluar;
                  return (
                    <div
                      key={log.id_log}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-sm font-semibold text-slate-800 block">
                          {log.nama_mahasiswa}
                        </span>
                        <span className="text-xs text-slate-500">
                          {log.nama_kelompok} •{' '}
                          {new Date(log.waktu_masuk).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isMasuk
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {isMasuk ? 'Masuk' : 'Keluar'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

