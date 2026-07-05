import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '@/components/shared/Layout';

// Import Komponen Halaman & Fitur
import LandingPage from '@/pages/LandingPage';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

// import AdminDashboard from '@/features/admin/components/AdminDashboard';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import UserProfilePage from '@/pages/UserProfilePage';
import BookDetail from '@/features/books/book-detail/BookDetail';
// import MyLoans from '@/features/loans/MyLoans';
import CartPage from '@/pages/CartPage';
import AddBookPage from '@/pages/AddBookPage';
import BookListCatalog from '@/features/books/components/BookListCatalog';
import CheckoutPage from '@/pages/CheckoutPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* === KELOMPOK 1: HALAMAN UTAMA PUBLIK (MENGGUNAKAN LAYOUT) === */}
        <Route element={<Layout />}>
          {/* Akses beranda tetap memunculkan Navbar & Hero Section */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/books' element={<BookListCatalog />} />
          <Route path='/books/:id' element={<BookDetail />} />
        </Route>

        {/* === KELOMPOK 2: AUTH PUBLIK (TANPA LAYOUT / FULL SCREEN) === */}
        {/* 💡 Sengaja dikeluarkan dari bungkusan Layout agar tampilan bersih 100% */}
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />

        {/* === KELOMPOK 3: INTERNAL USER TERPROTEKSI (MENGGUNAKAN LAYOUT) === */}
        <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
          <Route element={<Layout />}>
            {/* Halaman katalog internal setelah user berhasil masuk */}
            {/* <Route path='/books' element={<LandingPage />} /> */}
            <Route path='/' element={<LandingPage />} />
            {/* Anda bisa menambahkan rute internal lain di sini seperti /my-loans atau /profile */}
            <Route path='/profile' element={<UserProfilePage />} />
            <Route path='/cart' element={<CartPage />} />

            <Route path='/checkout' element={<CheckoutPage />} />
            {/* <Route path='/my-loans' element={<MyLoans />} /> */}
            <Route
              path='/profile'
              element={<div>Halaman Profil (Under Construction)</div>}
            />
          </Route>
        </Route>

        {/* === KELOMPOK 4: PANEL ADMIN TERPROTEKSI (MANDIRI / FULL SCREEN) === */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          {/* <Route path='/admin/dashboard' element={<AdminDashboard />} /> */}
          <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
          <Route path='/admin/books/add' element={<AddBookPage />} />
        </Route>

        {/* Fallback otomatis jika pengguna mengetik URL asal */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
