import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner'; // Menggunakan Sonner Toaster
import AppRoutes from './routes/AppRoutes'; // 💡 Impor konfigurasi rute Anda

// Inisialisasi klien untuk manajemen cache data API
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* 💡 Semua halaman termasuk Layout, Login, dan Hero dikendalikan di sini */}
        <AppRoutes />

        {/* Komponen umpan balik notifikasi global */}
        <Toaster position='top-right' richColors />
      </QueryClientProvider>
    </ReduxProvider>
  );
}
