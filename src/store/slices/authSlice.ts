import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// 1. Definisi Interface untuk Data User & State
export interface UserData {
  id: string | number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
}

export interface AuthState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 2. Ambil data awal dari localStorage (Pencegahan Reset saat Refresh dengan Validasi Aman)
const token = localStorage.getItem('token') || null;
const storedUser = localStorage.getItem('user');

const getInitialUser = (): UserData | null => {
  // Cegah pembacaan jika data kosong atau bernilai string rusak "undefined"/"null"
  if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
    return null;
  }
  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error(
      'Failed to parse initial user state from localStorage:',
      error
    );
    // Bersihkan otomatis memori lokal browser jika terdeteksi korup
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

const user = getInitialUser();

const initialState: AuthState = {
  user: user,
  token: token,
  // Status login hanya bernilai true jika kedapatan token DAN data user yang valid
  isAuthenticated: !!token && !!user,
  isLoading: false,
};

// 3. Pembuatan Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Dipanggil saat mutasi login atau register di React Query sukses
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: UserData }>
    ) => {
      const { token, user } = action.payload;

      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Persistensi ke penyimpanan lokal browser
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },

    // Dipanggil saat user menekan tombol logout di Navbar
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Bersihkan penyimpanan lokal browser
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    // Mengubah status loading state secara manual (jika diperlukan)
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { loginSuccess, logout, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
