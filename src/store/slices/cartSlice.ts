import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. Interface item keranjang sudah diekspor dengan benar
export interface CartItem {
  id: number;
  title: string;
  coverImage: string;
  authorName: string;
}

// 💡 2. PERBAIKAN UTAMA: Tambahkan kata kunci 'export' di depan interface ini!
export interface CartState {
  items: CartItem[];
}

// 3. Objek inisialisasi awal tetap sama
const initialState: CartState = {
  items: (() => {
    try {
      const savedCart = localStorage.getItem('booky_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  })(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Aksi 1: Menambahkan Buku Baru ke dalam Keranjang (Mencegah Duplikasi)
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const exists = state.items.some(
        (item: CartItem) => item.id === action.payload.id
      );
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem('booky_cart', JSON.stringify(state.items));
      }
    },

    // Aksi 2: Menghapus Buku dari Keranjang Berdasarkan ID
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item: CartItem) => item.id !== action.payload
      );
      localStorage.setItem('booky_cart', JSON.stringify(state.items));
    },

    // Aksi 3: Mengosongkan Seluruh Isi Keranjang (Misal setelah Checkout Berhasil)
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('booky_cart');
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
