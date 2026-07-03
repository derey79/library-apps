import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RootState } from '@/store/store';
import { removeFromCart, clearCart, CartItem } from '@/store/slices/cartSlice';
import axiosInstance from '@/api/axiosInstance';
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ApiErrorData {
  message?: string;
}

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { token } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // MUTASI PINJAM MASSAL: Melakukan loop request POST ke API untuk setiap buku di keranjang
  const processCheckoutMutation = useMutation<
    unknown,
    AxiosError<ApiErrorData>,
    void
  >({
    mutationFn: async () => {
      // Menembak endpoint POST /loans secara paralel untuk seluruh ID buku di dalam keranjang
      const checkoutPromises = cartItems.map((item: CartItem) =>
        axiosInstance.post(
          `/loans`,
          { bookId: item.id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );
      return Promise.all(checkoutPromises);
    },
    onSuccess: () => {
      toast.success('All book loan validations approved successfully!');
      dispatch(clearCart()); // Kosongkan keranjang di Redux & localStorage
      queryClient.invalidateQueries({ queryKey: ['myLoansHistory'] }); // Segarkan tab riwayat pinjam
      navigate('/profile?tab=borrowed'); // Lempar user langsung ke list peminjaman aktif mereka
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to finalize batch loan validation.';
      toast.error(errorMessage);
    },
  });

  return (
    <div className='w-full max-w-4xl mx-auto space-y-6 text-neutral-800 animate-fade-in pb-12'>
      {/* TOMBOL KEMBALI */}
      <Link
        to='/books'
        className='inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition select-none group'
      >
        <ArrowLeft className='h-4 w-4 group-hover:-translate-x-0.5 transition-transform' />
        Back to Catalog Matrix
      </Link>

      {/* HEADER SECTION */}
      <div>
        <h1 className='text-2xl font-extrabold text-neutral-950 tracking-tight'>
          Review Your Cart
        </h1>
        <p className='text-xs text-neutral-400 mt-0.5'>
          Verify your selected literature assets before launching system
          allocation procedures.
        </p>
      </div>

      {/* STRUKTUR UTAMA KONDISIONAL KELOLA KERANJANG */}
      {cartItems.length === 0 ? (
        /* KONDISI A: JIKA KERANJANG KOSONG */
        <div className='p-16 text-center border border-dashed border-neutral-200 bg-neutral-50/40 rounded-[24px] flex flex-col items-center justify-center space-y-4'>
          <div className='h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400'>
            <ShoppingBag className='h-5 w-5' />
          </div>
          <div className='space-y-1'>
            <p className='text-base text-neutral-900 font-bold'>
              Your Cart is Vacant
            </p>
            <p className='text-xs text-neutral-400 font-medium max-w-xs mx-auto leading-relaxed'>
              No literature entities are currently staged for loan authorization
              queries. Go find something interesting!
            </p>
          </div>
          <Link to='/books'>
            <button className='h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-md transition active:scale-95 cursor-pointer'>
              Explore Collection
            </button>
          </Link>
        </div>
      ) : (
        /* KONDISI B: JIKA ADA ITEM DI DALAM KERANJANG */
        <div className='space-y-6'>
          <div className='flex flex-col space-y-3'>
            {cartItems.map((item: CartItem) => (
              <div
                key={item.id}
                className='w-full bg-white border border-neutral-100 p-4 rounded-[22px] shadow-sm flex items-center justify-between gap-4 transition duration-200 hover:shadow-md'
              >
                {/* INFO KIRI: COVER BUKU & NAMA AUTHOR */}
                <div className='flex items-center gap-4 min-w-0 flex-1'>
                  <div className='h-20 w-14 rounded-lg bg-neutral-100 border border-neutral-200/60 overflow-hidden flex-shrink-0 shadow-inner flex items-center justify-center'>
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className='object-cover w-full h-full'
                      />
                    ) : (
                      <BookOpen className='h-4 w-4 text-neutral-400' />
                    )}
                  </div>
                  <div className='space-y-1 min-w-0'>
                    <h3 className='font-extrabold text-neutral-900 text-[15px] sm:text-base leading-snug truncate'>
                      {item.title}
                    </h3>
                    <p className='text-xs text-neutral-400 font-medium truncate'>
                      by{' '}
                      <span className='text-neutral-600 font-semibold'>
                        {item.authorName}
                      </span>
                    </p>
                  </div>
                </div>

                {/* AKSES KANAN: TOMBOL HAPUS ITEM DARI KERANJANG */}
                <button
                  type='button'
                  onClick={() => {
                    dispatch(removeFromCart(item.id));
                    toast.info(`"${item.title}" removed from cart.`);
                  }}
                  className='p-2.5 rounded-xl border border-neutral-100 bg-neutral-50/50 text-neutral-400 hover:text-rose-600 hover:bg-rose-50/40 hover:border-rose-100 transition cursor-pointer focus:outline-none shrink-0'
                  title='Remove book'
                >
                  <Trash2 className='h-4 w-4' />
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL SUMMARY PANEL & SUBMIT ACTION (LOWER FOOTER BAR) */}
          <div className='p-5 bg-white border border-neutral-100 rounded-[24px] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='text-center sm:text-left'>
              <span className='text-xs font-bold text-neutral-400 uppercase tracking-wider block'>
                Total Selected
              </span>
              <span className='text-lg font-extrabold text-neutral-900'>
                {cartItems.length} Archive Books
              </span>
            </div>

            <div className='flex items-center gap-3 w-full sm:w-auto'>
              {/* Batalkan Semua */}
              <button
                type='button'
                onClick={() => {
                  dispatch(clearCart());
                  toast.success('Cart cleared completely.');
                }}
                className='h-11 px-5 rounded-full border border-neutral-200 text-xs font-bold text-neutral-500 hover:text-neutral-800 bg-white transition cursor-pointer select-none focus:outline-none'
              >
                Clear Cart
              </button>

              {/* Checkout Utama */}
              <button
                type='button'
                onClick={() => processCheckoutMutation.mutate()}
                disabled={processCheckoutMutation.isPending}
                className='flex-1 sm:flex-initial h-11 px-8 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold tracking-wide transition shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer focus:outline-none select-none disabled:bg-neutral-400 disabled:cursor-not-allowed'
              >
                {processCheckoutMutation.isPending ? (
                  <>
                    <Loader2 className='h-3.5 w-3.5 animate-spin' />
                    <span>Allocating Nodes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className='h-3.5 w-3.5' />
                    <span>Confirm Loan Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
