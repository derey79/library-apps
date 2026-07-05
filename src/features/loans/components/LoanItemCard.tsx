import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axiosInstance from '@/api/axiosInstance';
import { BookOpen, Loader2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

import ReviewBookModal from './ReviewBookModal';
import { LoanItemCardProps, ApiErrorData } from '@/types/types';

export default function LoanItemCard({ loan, variant }: LoanItemCardProps) {
  const { token } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  const isReturned: boolean = loan.status === 'RETURNED';
  const isOverdue: boolean = loan.status === 'OVERDUE';
  const isAdmin: boolean = variant === 'ADMIN';

  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

  const formatDate = (dateString: string): string => {
    const date: Date = new Date(dateString);
    const months: string[] = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // MUTASI PATCH RETURN BUKU UNIVERSAL
  const returnMutation = useMutation<unknown, AxiosError<ApiErrorData>, void>({
    mutationFn: async () => {
      const endpoint: string = isAdmin
        ? `/admin/loans/${loan.id}`
        : `/loans/${loan.id}/return`;
      const bodyPayload: object = isAdmin ? { status: 'RETURNED' } : {};

      const response = await axiosInstance.patch(endpoint, bodyPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        isAdmin
          ? 'Admin: Return protocols verified.'
          : 'User: Return transaction complete.'
      );
      queryClient.invalidateQueries();
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      toast.error(
        error.response?.data?.message || 'Transaction rejected by server.'
      );
    },
  });

  return (
    <div className='w-full bg-white border border-neutral-100 rounded-[22px] p-5 shadow-sm space-y-4 hover:shadow-md transition duration-300 relative'>
      <div className='flex items-center justify-between text-xs font-bold'>
        <div className='flex items-center gap-1.5'>
          <span className='text-neutral-400 font-semibold'>Status</span>
          <span
            className={`px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[10px] ${
              isReturned
                ? 'bg-emerald-500/10 text-emerald-600'
                : isOverdue
                  ? 'bg-rose-500/10 text-rose-600 animate-pulse'
                  : 'bg-blue-500/10 text-blue-600'
            }`}
          >
            {loan.displayStatus}
          </span>
        </div>

        <div className='flex items-center gap-1.5'>
          <span className='text-neutral-400 font-semibold'>
            {isReturned ? 'Returned At' : 'Due Date'}
          </span>
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] ${
              isReturned
                ? 'bg-emerald-500/10 text-emerald-600'
                : isOverdue
                  ? 'bg-rose-500 text-white'
                  : 'bg-rose-500/10 text-rose-600'
            }`}
          >
            {loan.returnedAt
              ? formatDate(loan.returnedAt)
              : formatDate(loan.dueAt)}
          </span>
        </div>
      </div>

      {/* info buku */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1'>
        <div className='flex items-start gap-4 min-w-0 flex-1'>
          <div className='h-24 w-18 rounded-xl bg-neutral-50 border border-neutral-200/60 overflow-hidden shrink-0 shadow-sm flex items-center justify-center'>
            {loan.book?.coverImage ? (
              <img
                src={loan.book.coverImage}
                alt={loan.book.title}
                className='w-full h-full object-cover'
              />
            ) : (
              <BookOpen className='h-5 w-5 text-neutral-400' />
            )}
          </div>

          <div className='space-y-1.5 min-w-0 text-left'>
            <span className='inline-block text-[10px] font-extrabold tracking-wider text-blue-600 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10 uppercase'>
              {loan.book?.category?.name || 'General'}
            </span>
            <h3
              className='font-extrabold text-neutral-950 text-base leading-tight truncate max-w-md'
              title={loan.book?.title}
            >
              {loan.book?.title}
            </h3>
            <p className='text-xs text-neutral-400 font-medium truncate'>
              by{' '}
              <span className='text-neutral-600 font-semibold'>
                {loan.book?.author?.name}
              </span>
            </p>
            <div className='flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 font-mono'>
              <Clock className='h-3.5 w-3.5 text-neutral-400' />
              <span>
                Borrowed: {formatDate(loan.borrowedAt)} · {loan.durationDays}{' '}
                Days
              </span>
            </div>
          </div>
        </div>

        {/* info bagian kanan */}
        <div className='flex flex-col sm:flex-row md:flex-col sm:items-center md:items-end justify-between gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-50'>
          {isAdmin && loan.borrower && (
            <div className='text-left md:text-right'>
              <span className='text-[10px] font-bold text-neutral-400 uppercase tracking-wider block'>
                borrower's name
              </span>
              <span className='text-base font-extrabold text-neutral-900 leading-tight mt-0.5'>
                {loan.borrower.name}
              </span>
              <span className='text-xs font-medium text-neutral-400 block mt-0.5'>
                {loan.borrower.email}
              </span>
            </div>
          )}

          {!isAdmin && (
            <div className='flex flex-col gap-2 w-full sm:w-auto items-end'>
              {isReturned && (
                <button
                  type='button'
                  onClick={() => setIsReviewOpen(true)}
                  className='h-8 px-4 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-bold text-[11px] transition shadow-sm focus:outline-none cursor-pointer select-none active:scale-95'
                >
                  Review Book
                </button>
              )}

              {!isReturned && (
                <button
                  type='button'
                  disabled={returnMutation.isPending}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Confirm return verification for "${loan.book?.title}"?`
                      )
                    ) {
                      returnMutation.mutate();
                    }
                  }}
                  className='h-8 px-4 rounded-full bg-primary-300 hover:bg-primary-300/55 text-white font-bold text-[11px] flex items-center gap-1.5 transition shadow-sm focus:outline-none cursor-pointer select-none active:scale-95'
                >
                  {returnMutation.isPending ? (
                    <Loader2 className='h-3 w-3 animate-spin' />
                  ) : (
                    <CheckCircle className='h-3 w-3' />
                  )}
                  <span>Return Book</span>
                </button>
              )}
            </div>
          )}

          {/* SISI ACTION ADMIN */}
          {isAdmin && !isReturned && (
            <button
              type='button'
              disabled={returnMutation.isPending}
              onClick={() => {
                if (
                  window.confirm(
                    `Confirm return verification for "${loan.book?.title}"?`
                  )
                ) {
                  returnMutation.mutate();
                }
              }}
              className='h-9 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer focus:outline-none select-none active:scale-95'
            >
              {returnMutation.isPending ? (
                <Loader2 className='h-3.5 w-3.5 animate-spin' />
              ) : (
                <CheckCircle className='h-3.5 w-3.5' />
              )}
              <span>Return Book</span>
            </button>
          )}
        </div>
      </div>

      {/* 💡 2. AMAN DARI ANY TYPE: Properti bookId dibaca langsung sebagai tipe data angka murni (number) */}
      <ReviewBookModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        bookId={loan.book?.id || loan.id} // 🚀 Wajib menggunakan id buku asli database Anda
        bookTitle={loan.book?.title || 'Book'}
      />
    </div>
  );
}
