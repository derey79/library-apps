import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import BookGridHeader from '@/features/books/book-grid/BookGridHeader';
import BookCard, { Book } from '@/features/books/book-grid/BookCard';

interface BooksApiResponse {
  success: boolean;
  message: string;
  data: {
    books: Book[];
  };
}

interface BookGridProps {
  selectedCategoryId: number | null;
}

export default function BookGrid({ selectedCategoryId }: BookGridProps) {
  const [searchParams] = useSearchParams();
  const searchFilter = searchParams.get('search')?.toLowerCase().trim() || '';

  const { data, isLoading, isError } = useQuery<BooksApiResponse>({
    queryKey: ['recommendedBooks'],
    queryFn: async () => {
      const response = await axiosInstance.get('/books/recommend');
      return response.data;
    },
  });

  const allBooks = Array.isArray(data?.data?.books) ? data.data.books : [];

  const displayedBooks = allBooks.filter((book) => {
    const matchesCategory = selectedCategoryId
      ? book.categoryId === selectedCategoryId
      : true;
    const matchesSearch = searchFilter
      ? book.title.toLowerCase().includes(searchFilter) ||
        book.author?.name.toLowerCase().includes(searchFilter)
      : true;

    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-24 space-y-3'>
        <Loader2 className='h-7 w-7 text-blue-500 animate-spin' />
        <p className='text-sm font-medium text-zinc-400'>
          Loading catalog matrix recommendations...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-8 rounded-2xl bg-red-500/5 border border-red-500/10 text-center'>
        <p className='text-sm font-medium text-red-400'>
          Failed to sync streaming catalog data node.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Pemanggilan Sub-Header Modular */}
      <BookGridHeader
        isFiltered={!!selectedCategoryId || !!searchFilter}
        totalBooks={displayedBooks.length}
      />

      {/* Area Grid Render */}
      {displayedBooks.length === 0 ? (
        <div className='p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20'>
          <p className='text-sm text-zinc-500 font-medium'>
            No archived books discovered within this category block.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6'>
          {displayedBooks.map((book) => (
            /* Pemanggilan Kartu Buku Reusable */
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
