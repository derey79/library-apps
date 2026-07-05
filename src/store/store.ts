import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice'; // 💡 1. Impor cart reducer baru Anda

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer, // 💡 2. Daftarkan di sini agar RootState mengenali properti 'cart'
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
