import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axiosInstance from '@/api/axiosInstance';
import { Star, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import {
  ReviewBookModalProps,
  ReviewPayload,
  ApiErrorData,
} from '@/types/types';
import { Button } from '@/components/ui/button';

export default function ReviewBookModal({
  isOpen,
  onClose,
  bookId,
  bookTitle,
}: ReviewBookModalProps) {
  const { token } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  const [rating, setRating] = useState<number>(4); //by default bintang 4
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');

  const reviewMutation = useMutation<
    unknown,
    AxiosError<ApiErrorData>,
    ReviewPayload
  >({
    mutationFn: async (payload: ReviewPayload) => {
      const response = await axiosInstance.post(`/reviews`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        `Thank you! Your feedback for "${bookTitle}" has been recorded.`
      );
      setComment('');
      setRating(4);

      queryClient.invalidateQueries({ queryKey: ['bookDetail'] });
      queryClient.invalidateQueries({ queryKey: ['publicCatalogBooks'] });

      onClose();
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to submit your review parameter data.';
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Review thoughts text parameter cannot be empty.');
      return;
    }

    const cleanComment = comment.trim();

    reviewMutation.mutate({
      bookId: Number(bookId),
      star: Number(rating),
      comment: cleanComment,
      review: cleanComment,
      content: cleanComment,
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in'>
      <div className='w-full max-w-sm bg-white rounded-[24px] p-6 shadow-xl space-y-5 text-center animate-scale-in relative border border-neutral-100'>
        <button
          onClick={onClose}
          type='button'
          className='absolute top-5 right-5 text-neutral-900 hover:text-neutral-500 transition cursor-pointer focus:outline-none'
        >
          <X className='h-5 w-5 stroke-[2.5]' />
        </button>

        <div className='text-left w-full pl-1'>
          <h3 className='text-lg font-extrabold text-neutral-950 tracking-tight'>
            Give Review
          </h3>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-1.5 flex flex-col items-center justify-center w-full'>
            <span className='text-xs font-bold text-neutral-900 tracking-tight block'>
              Give Rating
            </span>
            <div className='flex items-center gap-1.5 pt-0.5'>
              {Array.from({ length: 5 }).map((_, index: number) => {
                const star = index + 1;
                const activeStar =
                  hoverRating !== null ? star <= hoverRating : star <= rating;
                return (
                  <button
                    key={star}
                    type='button'
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className='focus:outline-none transition cursor-pointer active:scale-90'
                  >
                    <Star
                      className={`h-7 w-7 transition-all duration-100 ${
                        activeStar
                          ? 'text-amber-400 fill-amber-400 scale-105'
                          : 'text-neutral-300 fill-neutral-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className='w-full px-1'>
            <textarea
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setComment(e.target.value)
              }
              placeholder='Please share your thoughts about this book'
              rows={5}
              className='w-full p-4 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-300 focus:ring-4 focus:ring-neutral-500/5 transition-all bg-white resize-none leading-relaxed text-left'
            />
          </div>

          <div className='w-full px-1'>
            <Button
              type='submit'
              disabled={reviewMutation.isPending}
              className='w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs tracking-wide transition shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer focus:outline-none select-none disabled:bg-neutral-300 disabled:cursor-not-allowed'
            >
              {reviewMutation.isPending ? (
                <Loader2 className='h-3.5 w-3.5 animate-spin' />
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
