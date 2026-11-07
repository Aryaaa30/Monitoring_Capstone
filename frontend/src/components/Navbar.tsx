'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, clearAuthSession } from '@/lib/api';
import {
  Radio,
  LayoutDashboard,
  FileText,
  Clock,
  Users,
  FolderGit2,
  CreditCard,
  LogOut,
  LogIn,
  ChevronDown,
} from 'lucide-react';

/**
 * Komponen Navigasi Utama: Menampilkan bilah menu atas untuk berpindah antar halaman sistem.
 */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /**
   * Fungsi: Memuat sesi pengguna saat komponen dimuat di peramban.
   */
  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  /**
   * Fungsi: Menangani proses keluar (logout) dan mengarahkan pengguna ke halaman login.
   */
  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    router.push('/login');
  };

  const navLinks = [
    { href: '/terminal', label: 'Terminal Presensi', icon: Radio },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/laporan', label: 'Laporan Capstone', icon: FileText },
    { href: '/presensi', label: 'Riwayat Log', icon: Clock },
  ];

  const masterLinks = [
    { href: '/master/mahasiswa', label: 'Data Mahasiswa', icon: Users },
    { href: '/master/kelompok', label: 'Data Kelompok', icon: FolderGit2 },
    { href: '/master/kartu', label: 'Data Kartu RFID', icon: CreditCard },
  ];

  return (
    <nav className="no-print bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Judul Sistem */}
          <div className="flex items-center space-x-3">
            <Link href="/terminal" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-md">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-lg leading-tight block">
                  Presensi Lab Capstone
                </span>
                <span className="text-xs text-sky-600 font-medium tracking-wide">
                  Teknologi Informasi FT UMY
                </span>
              </div>
            </Link>
          </div>

          {/* Menu Navigasi Tengah */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Dropdown Menu Master Data (Khusus Admin / Dosen) */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith('/master')
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Data Master</span>
                  <ChevronDown className="w-4 h-4 ml-0.5" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                    {masterLinks.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <SubIcon className="w-4 h-4 text-slate-500" />
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sisi Kanan: Status Pengguna / Tombol Login */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <span className="text-sm font-semibold text-slate-800 block">
                    {user.nama}
                  </span>
                  <span className="text-xs uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                    {user.peran}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Keluar dari sistem"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 bg-sky-600 text-white px-3.5 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 shadow-sm transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

