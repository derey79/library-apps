import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { Loader2, Inbox, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import BookGridHeader from '@/features/books/book-grid/BookGridHeader';
import BookCard, { Book } from '@/features/books/book-grid/BookCard';

interface MasterBooksData {
  books: Book[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

interface BooksApiResponse {
  success: boolean;
  message: string;
  data: Book[] | MasterBooksData;
}

interface BookGridProps {
  selectedCategoryId: number | null;
}

export default function BookGrid({ selectedCategoryId }: BookGridProps) {
  const [searchParams] = useSearchParams();
  const searchFilter = searchParams.get('search')?.trim() || '';

  // 💡 1. KONTROL LIMIT SEVER-SIDE: Default awal memuat 6 item buku rekomendasi
  const [limitCount, setLimitCount] = useState<number>(10);

  const targetEndpoint = searchFilter ? '/books' : '/books/recommend';

  const { data, isLoading, isError } = useQuery<BooksApiResponse>({
    /* 
      💡 2. UPDATE QUERY KEY SINKRONISASI: 
      Masukkan 'limitCount' ke dalam queryKey. Jika nilai limitCount berubah (misal dari 6 menjadi 50),
      TanStack Query otomatis mendeteksi perubahan dan langsung menembak ulang API rekomendasi ke server!
    */
    queryKey: ['homeBooksDisplay', targetEndpoint, searchFilter, limitCount],
    queryFn: async () => {
      const response = await axiosInstance.get(targetEndpoint, {
        params: {
          status: 'all',
          page: 1,
          // 💡 3. PARAMETER DINAMIS BACKEND:
          // Jika user melakukan search, buka limit sebesar 50 buku katalog master.
          // Jika sedang di mode rekomendasi normal, kirim nilai angka limitCount (6, lalu berubah saat di klik Load More).
          limit: searchFilter ? 50 : limitCount,
          q: searchFilter || undefined,
        },
      });
      return response.data;
    },
  });

  const getCleanBooksArray = (): Book[] => {
    const rawData = data?.data;
    if (!rawData) return [];

    if (Array.isArray(rawData)) {
      return rawData;
    }

    if ('books' in rawData && Array.isArray(rawData.books)) {
      return rawData.books;
    }

    return [];
  };

  const displayedBooks = getCleanBooksArray();

  // Penapisan kategori lokal pendukung sidebar genre Anda
  const filteredBooks = displayedBooks.filter((book) => {
    const matchesCategory = selectedCategoryId
      ? book.categoryId === selectedCategoryId
      : true;

    const matchesSearch = searchFilter
      ? book.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        book.author?.name?.toLowerCase().includes(searchFilter.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  // 💡 4. DETEKSI REKOMENDASI BERKELANJUTAN:
  // Tombol Load More akan terus muncul jika jumlah buku yang didapat dari server sama dengan limit kita saat ini.
  // Ini menandakan masih ada kemungkinan sisa baris buku rekomendasi lain di database backend Anda.
  const hasMoreRecommendations = displayedBooks.length >= limitCount;

  const handleLoadMore = () => {
    // 💡 5. LOGIKA PENAMBAHAN KUOTA: Setiap tombol diklik, naikkan limit penarikan data rekomendasi (+6 item berikutnya)
    setLimitCount((prev) => prev + 6);
  };

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-32 space-y-3 bg-white border border-neutral-100/60 rounded-[22px] shadow-sm'>
        <Loader2 className='h-7 w-7 text-blue-500 animate-spin' />
        <p className='text-xs font-semibold text-neutral-400'>
          Aligning decentralized catalog indexes...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-12 rounded-[22px] bg-red-500/5 border border-red-500/10 text-center'>
        <p className='text-xs font-semibold text-red-400'>
          Failed to synchronize streaming library database nodes.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6 w-full text-left'>
      <BookGridHeader
        isFiltered={!!selectedCategoryId || !!searchFilter}
        totalBooks={filteredBooks.length}
      />

      {filteredBooks.length === 0 ? (
        <div className='p-20 text-center border border-dashed border-neutral-200 rounded-[24px] bg-neutral-50/40 flex flex-col items-center justify-center space-y-2 w-full'>
          <Inbox className='h-6 w-6 text-neutral-400' />
          <p className='text-sm text-neutral-800 font-bold'>
            No Books Discovered
          </p>
        </div>
      ) : (
        <div className='w-full flex flex-col items-center space-y-8'>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 w-full'>
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* 💡 TOMBOL LOAD MORE REKOMENDASI ASLI BACKEND */}
          {!searchFilter && hasMoreRecommendations && (
            <div className='w-full flex items-center justify-center pt-2 animate-fade-in'>
              <Button
                type='button'
                variant='outline'
                onClick={handleLoadMore}
                className='h-11 px-6 rounded-full border-neutral-200 text-neutral-700 text-xs font-bold tracking-wide transition bg-white hover:bg-neutral-50 active:scale-95 flex items-center gap-2 cursor-pointer select-none focus:outline-none'
              >
                <span>Load More</span>
                <ChevronDown className='h-3.5 w-3.5 text-neutral-400' />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
