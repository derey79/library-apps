import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className='min-h-screen bg-base-background'>
      {/* 1. Lapisan Navigasi Atas */}
      <Navbar />

      {/* 2. Area Konten Utama - Menggunakan Lebar Penuh Responsif (Satu Kolom) */}
      <main className='custom-container py-8 px-4 mx-auto'>
        <div className='flex flex-col space-y-8 w-full'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
