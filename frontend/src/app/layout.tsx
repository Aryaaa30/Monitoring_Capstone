import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistem Monitoring Kehadiran Capstone UMY',
  description: 'Sistem Monitoring Kehadiran Capstone Berbasis Website dengan Pemanfaatan RFID pada Kartu Tanda Mahasiswa - TI UMY',
};

/**
 * Komponen Layout Utama: Membungkus seluruh halaman website Next.js.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 flex flex-col">
        {children}
      </body>
    </html>
  );
}

