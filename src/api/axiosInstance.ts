import axios from 'axios';

// 1. Ambil URL Dasar dari file .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. REQUEST INTERCEPTOR: Menyisipkan Token Otomatis ke Setiap Request
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil token terbaru dari localStorage
    const token = localStorage.getItem('token');

    // Jika token ada, sisipkan ke dalam Header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Tangani error yang terjadi saat request dikonfigurasi
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR: Menangani Error Global (Misal: Token Expired)
axiosInstance.interceptors.response.use(
  (response) => {
    // Jika response sukses (200-299), langsung teruskan data ke komponen
    return response;
  },
  (error) => {
    // Cek jika error bersumber dari status 401 (Token tidak valid / expired)
    if (error.response && error.response.status === 401) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.');

      // Bersihkan penyimpanan lokal
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Paksa halaman reload ke beranda/login agar state Redux/Zustand ikut ter-reset
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
