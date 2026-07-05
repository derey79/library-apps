import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { Loader2, Inbox } from 'lucide-react';
// 💡 1. IMPOR UTAMA: Panggil useSearchParams untuk membaca parameter pencarian URL Navbar
import { useSearchParams } from 'react-router-dom';

import BookFilterSidebar from '../book-grid/BookFilterSidebar';
import BookItemCard, { CatalogBookNode } from '../book-grid/BookItemCard';

interface BooksApiResponse {
  success: boolean;
  message: string;
  data: {
    books: CatalogBookNode[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export default function BookListCatalog() {
  // 💡 2. AMBIL URL PARAMETER: Tangkap string kata kunci aktif yang dikirim dari NavLinks Navbar
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search')?.trim() || '';

  const [category, setCategory] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery<BooksApiResponse>({
    /* 
      💡 3. SINKRONISASI QUERY KEY:
      Masukkan searchKeyword ke dalam array dependensi queryKey. 
      Jika user mengetik, TanStack Query otomatis mendeteksi perubahan dan langsung memicu penembakan API ulang!
    */
    queryKey: ['publicCatalogBooks', category, rating, searchKeyword],
    queryFn: async () => {
      const response = await axiosInstance.get('/books', {
        params: {
          status: 'all',
          page: 1,
          limit: 50,
          // 💡 4. PETAKAN PARAMETER BACKEND: Kirim kata kunci lewat properti 'q' murni ke backend Railway
          q: searchKeyword || undefined,
          // Filter kategori & rating database pendukung sidebar kiri tetap menyatu
          category: category || undefined,
          rating: rating || undefined,
        },
      });
      return response.data;
    },
  });

  const rawBooks = Array.isArray(data?.data?.books) ? data.data.books : [];

  // Logika penapisan sekunder sisi klien agar performa sidebar filter tetap terasa responsif
  const booksList = rawBooks.filter((book) => {
    if (
      category &&
      book.category?.name?.toLowerCase() !== category.toLowerCase()
    ) {
      return false;
    }
    if (rating && Math.floor(book.rating) !== rating) {
      return false;
    }
    return true;
  });

  return (
    <div className='w-full max-w-7xl mx-auto space-y-6 text-neutral-800 pb-16 animate-fade-in px-4 md:px-6 text-left'>
      <div className='text-left border-b border-neutral-100 pb-4'>
        <h1 className='text-2xl font-extrabold text-neutral-950 tracking-tight'>
          Book List
        </h1>
      </div>

      <div className='flex flex-col md:flex-row gap-6 items-start w-full'>
        {/* Kiri: Sidebar Filter Kapsul */}
        <BookFilterSidebar
          selectedCategory={category}
          onCategorySelect={setCategory}
          selectedRating={rating}
          onRatingSelect={setRating}
        />

        <div className='flex-1 w-full'>
          {isLoading ? (
            /* KONDISI 1: DATA SEDANG DIMUAT */
            <div className='flex flex-col items-center justify-center py-40 space-y-3 bg-white border border-neutral-100/60 rounded-[22px] shadow-sm w-full'>
              <Loader2 className='h-7 w-7 text-blue-500 animate-spin' />
              <p className='text-xs font-semibold text-neutral-400'>
                Streaming catalog matrices...
              </p>
            </div>
          ) : isError ? (
            /* KONDISI 2: JALUR API TERPUTUS */
            <div className='p-12 text-center bg-red-500/5 border border-red-500/10 rounded-[22px] w-full'>
              <p className='text-xs font-semibold text-red-400'>
                Failed to synchronize public library catalog index.
              </p>
            </div>
          ) : booksList.length === 0 ? (
            /* KONDISI 3: HASIL FILTER / PENCARIAN KOSONG */
            <div className='p-20 text-center border border-dashed border-neutral-200 bg-neutral-50/40 rounded-[24px] flex flex-col items-center justify-center space-y-2 w-full'>
              <Inbox className='h-6 w-6 text-neutral-400' />
              <p className='text-sm text-neutral-800 font-bold'>
                No Books Match Current Filters
              </p>
              <p className='text-xs text-neutral-400 font-medium max-w-xs leading-relaxed mx-auto'>
                {searchKeyword
                  ? `We couldn't discover any match parameters for "${searchKeyword}" inside our comprehensive database nodes.`
                  : 'Try resetting your category checkmarks or selected rating parameters to explore alternative literature nodes.'}
              </p>
            </div>
          ) : (
            /* KONDISI 4: DATA BERHASIL DIUNDUH (GRID REAKTIF) */
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full'>
              {booksList.map((book) => (
                <BookItemCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
