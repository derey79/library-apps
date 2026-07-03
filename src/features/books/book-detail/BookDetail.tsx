import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axiosInstance from '@/api/axiosInstance';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

import BookBreadcrumbs from './BookBreadcrumbs';
import BookInfo from './BookInfo';
import BookReviews, { Review } from './BookReviews';
import RelatedBooks from './RelatedBooks';

interface DetailedBook {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  author: { id: number; name: string; bio: string };
  category: { id: number; name: string };
  reviews: Review[];
}

interface SingleBookApiResponse {
  success: boolean;
  message: string;
  data: DetailedBook;
}

interface ApiErrorData {
  message?: string;
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Fetching Data Detail Buku Berdasarkan ID
  const { data, isLoading, isError } = useQuery<SingleBookApiResponse>({
    queryKey: ['bookDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/books/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Mutasi Request Peminjaman
  const borrowMutation = useMutation<unknown, AxiosError<ApiErrorData>, void>({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        `/loans`,
        { bookId: Number(id) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        'Book borrowed successfully! Track it in your Borrowed List.'
      );
      queryClient.invalidateQueries({ queryKey: ['bookDetail', id] });
    },
    // 2. 💡 GANTI tipe 'any' dengan 'AxiosError<ApiErrorData>' untuk menjamin Type-Safety
    onError: (error: AxiosError<ApiErrorData>) => {
      const errorMessage =
        error.response?.data?.message || 'Failed to process loan request.';
      toast.error(errorMessage);
    },
  });
  const book = data?.data;

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-32 space-y-3'>
        <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
        <p className='text-sm font-medium text-zinc-400'>
          Streaming book intelligence nodes...
        </p>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className='p-8 rounded-2xl bg-red-500/5 border border-red-500/10 text-center max-w-xl mx-auto my-12'>
        <p className='text-sm font-medium text-red-400'>
          Failed to locate the specified literature entry.
        </p>
        <Link
          to='/books'
          className='text-xs text-blue-400 hover:underline mt-2 inline-block'
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleBorrowClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to request book loan validation.');
      return;
    }
    borrowMutation.mutate();
  };

  return (
    <div className='w-full space-y-8 animate-fade-in text-neutral-800 pb-12'>
      {/* 1. Breadcrumbs */}
      <BookBreadcrumbs title={book.title} />

      {/* 2. Main Detail Layout */}
      <div className='grid grid-cols-1 md:grid-cols-12 gap-8 pt-2'>
        {/* Sampul Buku (Kolom Kiri) */}
        <div className='md:col-span-4 flex justify-center items-start'>
          <div className='w-full max-w-75 md:max-w-none bg-white p-4 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex items-center justify-center aspect-3/4 overflow-hidden'>
            <img
              src={book.coverImage}
              alt={book.title}
              className='w-full h-full object-cover rounded-[16px] shadow-sm'
            />
          </div>
        </div>

        {/* Info & Kontrol Aksi (Kolom Kanan) */}
        <BookInfo
          book={book}
          isAuthenticated={isAuthenticated}
          isAvailable={book.availableCopies > 0}
          isPending={borrowMutation.isPending}
          onBorrow={handleBorrowClick}
        />
      </div>

      {/* 3. Reviews List */}
      <BookReviews reviews={book.reviews} />

      <RelatedBooks currentBookId={book.id} categoryId={book.categoryId} />
    </div>
  );
}
