import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axiosInstance from '@/api/axiosInstance';
import { Loader2, Inbox } from 'lucide-react';

import LoanItemCard from '@/features/loans/components/LoanItemCard';
import { UserLoansApiResponse } from '@/types/types';

export default function BorrowedListTab() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery<UserLoansApiResponse>({
    queryKey: ['myLoansHistory', currentPage],
    queryFn: async () => {
      const response = await axiosInstance.get(`/loans/my`, {
        params: { status: 'all', page: currentPage, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const loansList = data?.data?.loans || [];
  const pagination = data?.data?.pagination;

  return (
    <div className='space-y-4 animate-fade-in text-neutral-800 text-left w-full'>
      <div className='pb-1'>
        <h2 className='text-lg font-extrabold text-neutral-950 tracking-tight'>
          Your Borrowed Books
        </h2>
        <p className='text-xs text-neutral-400 mt-0.5'>
          Track your active library assets parameters.
        </p>
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-20 w-full bg-white border border-neutral-100 rounded-[24px]'>
          <Loader2 className='h-6 w-6 text-blue-500 animate-spin' />
        </div>
      ) : isError ? (
        <div className='p-8 bg-red-500/5 border border-red-500/10 text-center text-red-400 rounded-2xl w-full'>
          Failed to stream personal transaction parameters.
        </div>
      ) : loansList.length === 0 ? (
        <div className='p-16 text-center border border-dashed border-neutral-200 bg-neutral-50/40 rounded-[24px] flex flex-col items-center justify-center space-y-2 w-full'>
          <Inbox className='h-6 w-6 text-neutral-400' />
          <p className='text-sm font-bold text-neutral-800'>
            No Archive Loans Discovered
          </p>
        </div>
      ) : (
        <div className='space-y-3.5 w-full'>
          {loansList.map((loan) => (
            <LoanItemCard key={loan.id} loan={loan} variant='USER' />
          ))}

          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-center gap-2 pt-4'>
              <button
                type='button'
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev: number) => Math.max(prev - 1, 1))
                }
                className='px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-600 disabled:opacity-40 hover:bg-neutral-50 transition cursor-pointer focus:outline-none'
              >
                Previous
              </button>
              <span className='text-xs font-mono font-bold text-neutral-400'>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                type='button'
                disabled={currentPage === pagination.totalPages}
                onClick={() =>
                  setCurrentPage((prev: number) =>
                    Math.min(prev + 1, pagination.totalPages)
                  )
                }
                className='px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-600 disabled:opacity-40 hover:bg-neutral-50 transition cursor-pointer focus:outline-none'
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
