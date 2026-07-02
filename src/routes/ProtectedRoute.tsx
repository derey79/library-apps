import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
  allowedRoles?: ('USER' | 'ADMIN')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();

  // Ambil data autentikasi dari global state Redux
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // 1. KONDISI: Jika user belum login, lempar ke halaman login
  if (!isAuthenticated) {
    // state={{ from: location }} berguna agar setelah login sukses, user bisa dikembalikan ke halaman terakhir yang ingin mereka buka
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // 2. KONDISI: Jika user sudah login tapi Role-nya tidak diizinkan masuk ke halaman ini
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to='/books' replace />;
  }

  // 3. KONDISI: Lolos semua validasi, render komponen halaman anak (sub-routes)
  return <Outlet />;
};

export default ProtectedRoute;
