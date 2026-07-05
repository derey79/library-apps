import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// 1. Definisi Interface untuk Data User & State
export interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  phone: string | null; // 💡 TAMBAHKAN BARIS INI
  avatarUrl?: string | null;
  createdAt?: string;
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
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    // 💡 TAMBAHKAN REDUCER BARU INI UNTUK SINKRONISASI NAMA
    updateUser: (
      state,
      action: PayloadAction<{ name: string; phone: string | null }>
    ) => {
      if (state.user) {
        // Perbarui data di state global Redux
        state.user.name = action.payload.name;
        state.user.phone = action.payload.phone;

        // Perbarui juga data di localStorage agar saat di-refresh tidak kembali ke nama lama
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions; // 💡 Ekspor aksinya
export default authSlice.reducer;
