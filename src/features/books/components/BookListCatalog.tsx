import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { Inbox } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import BookFilterSidebar from '../book-grid/BookFilterSidebar';
import BookItemCard, { CatalogBookNode } from '../book-grid/BookItemCard';
import BookCardSkeleton from '../book-grid/BookCardSkeleton';

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
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search')?.trim() || '';

  const [category, setCategory] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery<BooksApiResponse>({
    queryKey: ['publicCatalogBooks', category, rating, searchKeyword],
    queryFn: async () => {
      const response = await axiosInstance.get('/books', {
        params: {
          status: 'all',
          page: 1,
          limit: 50,

          q: searchKeyword || undefined,
          category: category || undefined,
          rating: rating || undefined,
        },
      });
      return response.data;
    },
  });

  const rawBooks = Array.isArray(data?.data?.books) ? data.data.books : [];

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
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full'>
              {Array.from({ length: 8 }).map((_, index) => (
                <BookCardSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <div className='p-12 text-center bg-red-500/5 border border-red-500/10 rounded-[22px] w-full'>
              <p className='text-xs font-semibold text-red-400'>
                Failed to synchronize public library catalog index.
              </p>
            </div>
          ) : booksList.length === 0 ? (
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
