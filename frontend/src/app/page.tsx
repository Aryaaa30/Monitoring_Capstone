import { redirect } from 'next/navigation';

/**
 * Halaman Utama (Index): Mengarahkan pengguna langsung ke Terminal Presensi Lab.
 */
export default function HomePage() {
  redirect('/terminal');
}

