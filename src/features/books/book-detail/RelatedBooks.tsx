import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { Loader2, Bookmark } from 'lucide-react';
import BookCard, { Book } from '../book-grid/BookCard';

interface BooksApiResponse {
  success: boolean;
  message: string;
  data: {
    books: Book[];
  };
}

interface RelatedBooksProps {
  currentBookId: number;
  categoryId: number;
}

export default function RelatedBooks({
  currentBookId,
  categoryId,
}: RelatedBooksProps) {
  // Fetch data rekomendasi global untuk disaring berdasarkan kategori serupa
  const { data, isLoading, isError } = useQuery<BooksApiResponse>({
    queryKey: ['recommendedBooks'],
    queryFn: async () => {
      const response = await axiosInstance.get('/books/recommend');
      return response.data;
    },
  });

  const allBooks = Array.isArray(data?.data?.books) ? data.data.books : [];

  // 💡 LOGIKA PENYARINGAN BUKU TERKAIT:
  // Saring buku yang memiliki categoryId sama, tapi JANGAN masukkan buku yang sedang dibuka saat ini
  const relatedBooks = allBooks.filter(
    (book) => book.categoryId === categoryId && book.id !== currentBookId
  );

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-12 space-y-2 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50'>
        <Loader2 className='h-5 w-5 text-blue-500 animate-spin' />
        <p className='text-xs font-medium text-neutral-400'>
          Discovering related nodes...
        </p>
      </div>
    );
  }

  // Jika error atau tidak ada buku terkait yang ditemukan, sembunyikan section ini secara halus (UX Standar)
  if (isError || relatedBooks.length === 0) return null;

  return (
    <div className='pt-8 border-t border-neutral-100 space-y-6'>
      {/* JUDUL SECTION */}
      <div className='flex items-center gap-2'>
        <Bookmark className='h-5 w-5 text-neutral-700' />
        <h2 className='text-lg font-bold text-neutral-950 tracking-tight'>
          Related Books
        </h2>
      </div>

      {/* GRID DAFTAR BUKU TERKAIT (MENGGUNAKAN BOOKCARD REUSABLE) */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6'>
        {relatedBooks.slice(0, 5).map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
