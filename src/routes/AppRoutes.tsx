import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '@/components/shared/Layout';
import { Loader2 } from 'lucide-react';

// 💡 1. Gunakan React.lazy untuk memecah halaman menjadi chunk dinamis
const LandingPage = React.lazy(() => import('@/pages/LandingPage'));
const LoginForm = React.lazy(() =>
  import('@/features/auth/components/LoginForm').then((module) => ({
    default: module.LoginForm,
  }))
);
const RegisterForm = React.lazy(() =>
  import('@/features/auth/components/RegisterForm').then((module) => ({
    default: module.RegisterForm,
  }))
);
const AdminDashboardPage = React.lazy(
  () => import('@/pages/AdminDashboardPage')
);
const UserProfilePage = React.lazy(() => import('@/pages/UserProfilePage'));
const BookDetail = React.lazy(
  () => import('@/features/books/book-detail/BookDetail')
);
const CartPage = React.lazy(() => import('@/pages/CartPage'));
const AddBookPage = React.lazy(() => import('@/pages/AddBookPage'));
const BookListCatalog = React.lazy(
  () => import('@/features/books/components/BookListCatalog')
);
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage'));

// 💡 2. Komponen Loading Spinner indikator transisi antar halaman
const PageLoader = () => (
  <div className='flex h-screen w-screen flex-col items-center justify-center bg-white gap-2'>
    <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
    <span className='text-sm font-medium text-neutral-500'>
      Memuat halaman...
    </span>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      {/* 💡 3. Bungkus seluruh rute di dalam Suspense */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* === KELOMPOK 1: HALAMAN UTAMA PUBLIK (MENGGUNAKAN LAYOUT) === */}
          <Route element={<Layout />}>
            <Route path='/' element={<LandingPage />} />
            <Route path='/books' element={<BookListCatalog />} />
            <Route path='/books/:id' element={<BookDetail />} />
          </Route>

          {/* === KELOMPOK 2: AUTH PUBLIK (TANPA LAYOUT / FULL SCREEN) === */}
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />

          {/* === KELOMPOK 3: INTERNAL USER TERPROTEKSI (MENGGUNAKAN LAYOUT) === */}
          <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
            <Route element={<Layout />}>
              <Route path='/' element={<LandingPage />} />
              {/* Catatan: Duplikasi rute /profile di bawah telah dibersihkan agar mengarah ke UserProfilePage */}
              <Route path='/profile' element={<UserProfilePage />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/checkout' element={<CheckoutPage />} />
            </Route>
          </Route>

          {/* === KELOMPOK 4: PANEL ADMIN TERPROTEKSI (MANDIRI / FULL SCREEN) === */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
            <Route path='/admin/books/add' element={<AddBookPage />} />
          </Route>

          {/* Fallback otomatis jika pengguna mengetik URL asal */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
