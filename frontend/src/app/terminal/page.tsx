'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { API_BASE_URL } from '@/lib/api';
import {
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LogIn,
  LogOut,
  Sparkles,
  User,
  Users,
  Target,
  History,
} from 'lucide-react';

interface TapResult {
  hasil: 'MASUK' | 'KELUAR' | 'TAP_GANDA' | 'KARTU_TIDAK_TERDAFTAR';
  pesan: string;
  nama?: string;
  nim?: string;
  kelompok?: string;
  judul_proyek?: string;
  waktu?: string;
  durasi_menit?: number;
  durasi_formatted?: string;
  target_jam?: number;
  total_jam?: number;
  uid?: string;
}

/**
 * Halaman Terminal Presensi (Kiosk Mode):
 * Ditempatkan pada komputer di dekat pintu masuk lab untuk membaca tap kartu RFID KTM secara otomatis.
 */
export default function TerminalPage() {
  const [rfidInput, setRfidInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<TapResult | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  // Referensi ke elemen input agar selalu terfokus (auto-focus untuk scanner USB)
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Fungsi: Memperbarui jam digital dan tanggal secara waktu nyata (setiap 1 detik).
   */
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Fungsi: Memastikan kursor selalu fokus pada input RFID agar siap membaca tap kartu kapan saja.
   */
  useEffect(() => {
    const focusInput = () => {
      inputRef.current?.focus();
    };

    focusInput();
    const interval = setInterval(focusInput, 2000);
    window.addEventListener('click', focusInput);

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', focusInput);
    };
  }, []);

  /**
   * Fungsi: Memuat riwayat aktivitas tap presensi terbaru hari ini dari backend.
   */
  const loadRecentLogs = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`${API_BASE_URL}/presensi/logs?tanggal=${today}`);
      if (res.ok) {
        const data = await res.json();
        setRecentLogs(data.slice(0, 8));
      }
    } catch {
      // Abaikan bila backend belum menyala
    }
  };

  useEffect(() => {
    loadRecentLogs();
  }, []);

  /**
   * Fungsi: Memainkan nada suara (beep) untuk memberikan respons audio saat tap kartu.
   */
  const playAudioTone = (type: 'success' | 'warn' | 'error') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'warn') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // Peramban mungkin membatasi audio sebelum interaksi pengguna
    }
  };

  /**
   * Fungsi: Mengirimkan UID hasil pembacaan RFID ke backend untuk dicatat sebagai presensi masuk/keluar.
   */
  const handleTapCard = async (uidToTap: string) => {
    if (!uidToTap || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/presensi/tap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: uidToTap.trim(), jeda_detik: 10 }),
      });

      const result: TapResult = await response.json();
      setLastResult(result);

      if (result.hasil === 'MASUK' || result.hasil === 'KELUAR') {
        playAudioTone('success');
      } else if (result.hasil === 'TAP_GANDA') {
        playAudioTone('warn');
      } else {
        playAudioTone('error');
      }

      loadRecentLogs();
    } catch (err: any) {
      setLastResult({
        hasil: 'KARTU_TIDAK_TERDAFTAR',
        pesan: 'Gagal terhubung ke server backend. Pastikan server NestJS & SQL Server telah berjalan.',
      });
      playAudioTone('error');
    } finally {
      setLoading(false);
      setRfidInput('');
      inputRef.current?.focus();
    }
  };

  /**
   * Fungsi: Menangkap peristiwa penekanan tombol Enter dari RFID Reader USB.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTapCard(rfidInput);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <Navbar />

      {/* Input Tersembunyi untuk Menerima Karakter dari RFID Reader USB */}
      <input
        ref={inputRef}
        type="text"
        value={rfidInput}
        onChange={(e) => setRfidInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="opacity-0 absolute top-0 left-0 h-0 w-0 pointer-events-none"
        aria-hidden="true"
        autoComplete="off"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
        {/* Header Jam & Informasi Laboratorium */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-2xl p-6 shadow-xl mb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-sky-400 font-semibold text-sm tracking-wider uppercase mb-1">
              <Radio className="w-4 h-4 animate-pulse text-sky-400" />
              <span>TERMINAL PRESENSI RFID OTOMATIS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Laboratorium Capstone Project
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Program Studi Teknologi Informasi — Universitas Muhammadiyah Yogyakarta
            </p>
          </div>

          <div className="text-center md:text-right bg-slate-950/60 border border-slate-800 px-6 py-3 rounded-xl shadow-inner">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-sky-400 tracking-wider">
              {currentTime || '--:--:--'}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1 flex items-center justify-center md:justify-end space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentDate || 'Memuat tanggal...'}</span>
            </div>
          </div>
        </div>

        {/* Konten Utama: Panel Status Tap & Panel Riwayat Sisi Kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
          {/* Kolom Kiri: Layar Interaktif Tap Kartu (8 Kolom) */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Tampilan Standby (Saat Belum Ada Kartu Ditempelkan) */}
            {!lastResult && (
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800/90 to-slate-850 border-2 border-dashed border-sky-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-sky-500/5 backdrop-blur-[2px] pointer-events-none" />

                {/* Animasi Gelombang Tap RFID */}
                <div className="relative mb-8">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-sky-500/10 flex items-center justify-center animate-ping absolute inset-0" />
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white shadow-2xl shadow-sky-500/40 relative z-10">
                    <Radio className="w-16 h-16 sm:w-20 sm:h-20 animate-pulse" />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  Silakan Tempelkan KTM Anda
                </h2>
                <p className="text-slate-300 text-base max-w-md mx-auto leading-relaxed">
                  Dekatkan Kartu Tanda Mahasiswa (chip RFID) pada perangkat reader USB di meja.
                  Sistem akan otomatis mencatat waktu masuk atau keluar.
                </p>

                <div className="mt-8 flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Reader Siap Menerima Tap</span>
                </div>
              </div>
            )}

            {/* Tampilan Hasil Tap: PRESENSI MASUK (Hijau Emerald) */}
            {lastResult && lastResult.hasil === 'MASUK' && (
              <div className="flex-1 flex flex-col justify-center bg-gradient-to-br from-emerald-950/80 via-slate-800 to-slate-900 border-2 border-emerald-500/70 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-950/50 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                    <LogIn className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                      STATUS PRESENSI
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      PRESENSI MASUK BERHASIL!
                    </h2>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 space-y-4 mb-6 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400 text-sm flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>Nama Mahasiswa</span>
                    </span>
                    <span className="text-lg font-bold text-white text-right">
                      {lastResult.nama}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400 text-sm">Nomor Induk Mahasiswa (NIM)</span>
                    <span className="text-base font-mono font-semibold text-emerald-300">
                      {lastResult.nim}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400 text-sm flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>Kelompok Capstone</span>
                    </span>
                    <span className="text-base font-semibold text-slate-200">
                      {lastResult.kelompok}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm flex items-center space-x-1.5">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span>Akumulasi Kehadiran Lab</span>
                    </span>
                    <span className="text-base font-bold text-emerald-400">
                      {lastResult.total_jam} Jam / Target {lastResult.target_jam} Jam
                    </span>
                  </div>
                </div>

                <p className="text-emerald-300/90 text-sm font-medium bg-emerald-950/40 border border-emerald-500/20 px-4 py-2.5 rounded-xl">
                  {lastResult.pesan}
                </p>
              </div>
            )}

            {/* Tampilan Hasil Tap: PRESENSI KELUAR (Biru Sky) */}
            {lastResult && lastResult.hasil === 'KELUAR' && (
              <div className="flex-1 flex flex-col justify-center bg-gradient-to-br from-sky-950/80 via-slate-800 to-slate-900 border-2 border-sky-500/70 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-sky-950/50 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/40">
                    <LogOut className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
                      STATUS PRESENSI
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      PRESENSI KELUAR BERHASIL!
                    </h2>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-6 space-y-4 mb-6 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400 text-sm flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-sky-400" />
                      <span>Nama Mahasiswa</span>
                    </span>
                    <span className="text-lg font-bold text-white text-right">
                      {lastResult.nama}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400 text-sm">Durasi Sesi Ini</span>
                    <span className="text-lg font-bold text-sky-300">
                      {lastResult.durasi_formatted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400 text-sm flex items-center space-x-1.5">
                      <Target className="w-4 h-4 text-sky-400" />
                      <span>Total Akumulasi Baru</span>
                    </span>
                    <span className="text-lg font-extrabold text-sky-400">
                      {lastResult.total_jam} Jam / Target {lastResult.target_jam} Jam
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(((lastResult.total_jam || 0) / (lastResult.target_jam || 20)) * 100),
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <p className="text-sky-300/90 text-sm font-medium bg-sky-950/40 border border-sky-500/20 px-4 py-2.5 rounded-xl">
                  {lastResult.pesan}
                </p>
              </div>
            )}

            {/* Tampilan Hasil Tap: TAP GANDA (Debounce Filter) */}
            {lastResult && lastResult.hasil === 'TAP_GANDA' && (
              <div className="flex-1 flex flex-col justify-center bg-gradient-to-br from-amber-950/80 via-slate-800 to-slate-900 border-2 border-amber-500/70 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                      PERINGATAN
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      TAP TERLALU CEPAT
                    </h2>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 mb-6">
                  <p className="text-slate-200 text-base leading-relaxed mb-2">
                    Kartu mahasiswa milik <strong className="text-amber-400">{lastResult.nama}</strong> ({lastResult.nim}) baru saja ditempelkan.
                  </p>
                  <p className="text-slate-400 text-sm">
                    Sistem mengabaikan tap berulang dalam rentang waktu singkat untuk mencegah data ganda yang tidak disengaja.
                  </p>
                </div>

                <p className="text-amber-300 text-sm bg-amber-950/40 border border-amber-500/20 px-4 py-2.5 rounded-xl">
                  {lastResult.pesan}
                </p>
              </div>
            )}

            {/* Tampilan Hasil Tap: KARTU TIDAK TERDAFTAR */}
            {lastResult && lastResult.hasil === 'KARTU_TIDAK_TERDAFTAR' && (
              <div className="flex-1 flex flex-col justify-center bg-gradient-to-br from-rose-950/80 via-slate-800 to-slate-900 border-2 border-rose-500/70 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                    <XCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
                      KARTU DITOLAK
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      KARTU BELUM TERDAFTAR
                    </h2>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 mb-6">
                  <p className="text-slate-200 text-base leading-relaxed mb-2">
                    Nomor UID kartu yang terbaca: <code className="bg-slate-800 text-rose-300 px-2 py-0.5 rounded font-mono font-bold">{lastResult.uid || 'Tidak diketahui'}</code>
                  </p>
                  <p className="text-slate-400 text-sm">
                    KTM ini belum dikaitkan dengan akun mahasiswa manapun atau kartu berstatus non-aktif. Silakan temui Administrator Laboratorium untuk pendaftaran kartu.
                  </p>
                </div>

                <p className="text-rose-300 text-sm bg-rose-950/40 border border-rose-500/20 px-4 py-2.5 rounded-xl">
                  {lastResult.pesan}
                </p>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Stream Riwayat Tap Hari Ini (4 Kolom) */}
          <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-white text-base">Aktivitas Hari Ini</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                Live
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[460px]">
              {recentLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Belum ada presensi tercatat hari ini.
                </div>
              ) : (
                recentLogs.map((log) => {
                  const isMasuk = !log.waktu_keluar;
                  const time = new Date(log.waktu_masuk).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <div
                      key={log.id_log}
                      className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-3 flex items-center justify-between hover:border-slate-600 transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-sm text-slate-100 block">
                          {log.nama_mahasiswa}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {log.nim} • {log.nama_kelompok}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center space-x-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                            isMasuk
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-sky-950 text-sky-300 border border-sky-800'
                          }`}
                        >
                          {isMasuk ? 'Masuk' : 'Keluar'}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                          {time}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Panel Bawah: Simulasi Uji Coba Cepat (Bila Tanpa Perangkat Fisik RFID) */}
        <div className="mt-6 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>
              <strong>Simulasi Cepat (Demo Pengujian):</strong> Klik tombol di kanan untuk mencoba tap tanpa RFID reader fisik.
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleTapCard('0012345678')}
              className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 px-3 py-1.5 rounded-lg font-mono font-medium transition-colors"
            >
              Tap Kartu A (0012345678)
            </button>
            <button
              onClick={() => handleTapCard('0098765432')}
              className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 px-3 py-1.5 rounded-lg font-mono font-medium transition-colors"
            >
              Tap Kartu B (0098765432)
            </button>
            <button
              onClick={() => handleTapCard('9999999999')}
              className="bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 px-3 py-1.5 rounded-lg font-mono font-medium transition-colors"
            >
              Tap Kartu Liar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

