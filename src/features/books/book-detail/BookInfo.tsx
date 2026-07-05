import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { addToCart } from '@/store/slices/cartSlice';
import { RootState } from '@/store/store';
import { Loader2, Star, Check, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

// 💡 Interface Item Keranjang Belanja
interface CartItem {
  id: number;
  title: string;
  coverImage: string;
  authorName: string;
}

// 💡 Interface Props yang disesuaikan 100% dengan Objek Data Asli API Anda
interface BookInfoProps {
  book: {
    id: number;
    title: string;
    description: string;
    rating: number;
    reviewCount: number;
    availableCopies: number;
    coverImage: string;
    author?: {
      name: string;
    };
    category?: {
      name: string;
    };
  };
  isAuthenticated: boolean;
  isAvailable: boolean;
  isPending: boolean;
  onBorrow: () => void;
}

export default function BookInfo({
  book,
  isAuthenticated,
  isAvailable,
  isPending,
}: BookInfoProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isInCart = cartItems.some((item: CartItem) => item.id === book?.id);

  const handleAddToCart = () => {
    if (!book) return;
    dispatch(
      addToCart({
        id: book.id,
        title: book.title,
        coverImage: book.coverImage,
        authorName: book.author?.name || 'Unknown Author',
      })
    );
    toast.success(`"${book.title}" added to your cart!`);
  };

  const handleDirectBorrowCheckout = () => {
    if (!book) return;
    if (!isAuthenticated) {
      toast.error('Please sign in before requesting loan validation.');
      navigate('/login');
      return;
    }

    if (!isInCart) {
      dispatch(
        addToCart({
          id: book.id,
          title: book.title,
          coverImage: book.coverImage,
          authorName: book.author?.name || 'Unknown Author',
        })
      );
    }
    navigate('/cart');
  };

  // UX Guard: Jika objek buku belum siap, jangan render teks kosong
  if (!book) return null;

  return (
    <div className='md:col-span-8 flex flex-col space-y-6 px-4'>
      {/* 1. Badge Kategori & Judul Utama */}
      <div className='space-y-2 text-left'>
        <span className='inline-block px-3 py-1 border border-neutral-200 text-neutral-600 rounded-md text-sm font-semibold'>
          {book.category?.name || 'General Archive'}
        </span>
        <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 leading-tight'>
          {book.title || 'Loading Title...'}
        </h1>
        <p className='text-md font-semibold text-neutral-500'>
          by{' '}
          <span className='text-neutral-700'>
            {book.author?.name || 'Anonymous Author'}
          </span>
        </p>
      </div>

      {/* 2. Rating Ringkas */}
      <div className='flex items-center gap-1.5 text-sm font-bold text-neutral-800 bg-neutral-50 w-fit px-3 py-1.5 rounded-full border border-neutral-100'>
        <Star className='h-4 w-4 text-amber-400 fill-amber-400' />
        <span>{book.rating ? `${book.rating}.0` : '0.0'} / 5.0</span>
      </div>

      {/* 3. METADATA MATRIKS HORIZONTAL */}
      <div className='grid grid-cols-3 gap-4 py-4 border-y border-neutral-100 max-w-md'>
        <div className='space-y-1 text-left'>
          <span className='text-xl font-extrabold text-neutral-900 block'>
            {book.availableCopies ?? 0}
          </span>
          <span className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>
            Stock
          </span>
        </div>
        <div className='space-y-1 border-x border-neutral-100 px-4 text-left'>
          <span className='text-xl font-extrabold text-neutral-900 block'>
            {book.rating ? `${book.rating}.0` : '0.0'}
          </span>
          <span className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>
            Rating
          </span>
        </div>
        <div className='space-y-1 px-2 text-left'>
          <span className='text-xl font-extrabold text-neutral-900 block'>
            {book.reviewCount ?? 0}
          </span>
          <span className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>
            Reviews
          </span>
        </div>
      </div>

      {/* 4. AREA DESKRIPSI BUKU */}
      <div className='space-y-2 text-left'>
        <h3 className='text-base font-bold text-neutral-950 tracking-tight'>
          Description
        </h3>
        <p className='text-[14px] leading-relaxed text-neutral-500 font-normal'>
          {book.description ||
            'No description summary available inside this literature entry.'}
        </p>
      </div>

      {/* 5. BLOCK AREA TOMBOL AKSI UTAMA */}
      {isAuthenticated ? (
        <div className='flex flex-wrap items-center gap-4 pt-2'>
          {/* TOMBOL ADD TO CART */}
          <button
            type='button'
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`h-12 px-8 rounded-full border text-sm font-bold tracking-wide transition shadow-sm cursor-pointer focus:outline-none flex items-center gap-2 ${
              isInCart
                ? 'bg-neutral-50 border-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 active:scale-95'
            }`}
          >
            {isInCart ? (
              <>
                <Check className='h-4 w-4 text-emerald-500' />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className='h-4 w-4 text-neutral-400' />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* TOMBOL BORROW BOOK DIRECT CHECKOUT */}
          <button
            onClick={handleDirectBorrowCheckout}
            disabled={isPending || !isAvailable}
            type='button'
            className={`h-12 px-10 rounded-full font-bold text-sm tracking-wide text-white transition shadow-md cursor-pointer flex items-center justify-center gap-2 focus:outline-none ${
              !isAvailable
                ? 'bg-neutral-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-500/10'
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span>Processing...</span>
              </>
            ) : isAvailable ? (
              'Borrow Book'
            ) : (
              'Out of Stock'
            )}
          </button>
        </div>
      ) : (
        /* KONDISI BANNED AJAKAN MASUK AKUN JIKA USER BELUM LOGIN */
        <div className='p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-left max-w-md'>
          <p className='text-xs font-semibold text-blue-600 leading-relaxed'>
            Interested in reading this book?{' '}
            <Link
              to='/login'
              className='underline font-bold hover:text-blue-700'
            >
              Sign In
            </Link>{' '}
            or{' '}
            <Link
              to='/register'
              className='underline font-bold hover:text-blue-700'
            >
              Create an Account
            </Link>{' '}
            to gain full loan permissions.
          </p>
        </div>
      )}
    </div>
  );
}
