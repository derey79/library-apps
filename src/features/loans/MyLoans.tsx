import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axiosInstance from '@/api/axiosInstance';
import { Loader2, Inbox } from 'lucide-react';

import LoansHeader from './LoansHeader';
import LoansTabs from './LoansTabs';
import LoanRow, { LoanRecord } from './LoanRow';
import LoansPagination from './LoansPagination';

interface LoansApiResponse {
  success: boolean;
  message: string;
  data: {
    loans: LoanRecord[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export default function MyLoans() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery<LoansApiResponse>({
    queryKey: ['myLoansHistory', activeStatus, currentPage],
    queryFn: async () => {
      const response = await axiosInstance.get(`/loans/my`, {
        params: { status: activeStatus, page: currentPage, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const loanRecords = Array.isArray(data?.data?.loans) ? data.data.loans : [];
  const pagination = data?.data?.pagination;

  const handleTabChange = (status: string) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  return (
    <div className='w-full space-y-6 text-neutral-800 animate-fade-in'>
      <LoansHeader />

      <LoansTabs activeStatus={activeStatus} onTabChange={handleTabChange} />

      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-32 space-y-2'>
          <Loader2 className='h-7 w-7 text-blue-500 animate-spin' />
          <p className='text-xs font-medium text-neutral-400'>
            Syncing loan ledger nodes...
          </p>
        </div>
      ) : isError ? (
        <div className='p-8 rounded-2xl bg-red-500/5 border border-red-500/10 text-center max-w-xl mx-auto'>
          <p className='text-sm font-medium text-red-400'>
            Failed to stream user borrowing archives.
          </p>
        </div>
      ) : loanRecords.length === 0 ? (
        <div className='p-16 text-center border border-dashed border-neutral-200 bg-neutral-50/40 rounded-[24px] flex flex-col items-center justify-center space-y-3'>
          <div className='h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400'>
            <Inbox className='h-5 w-5' />
          </div>
          <div className='space-y-0.5'>
            <p className='text-sm text-neutral-800 font-bold'>
              No Loan Records Discovered
            </p>
            <p className='text-xs text-neutral-400 font-medium'>
              You don't have any book borrow certificates inside this matrix
              pool.
            </p>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='flex flex-col space-y-3'>
            {loanRecords.map((record) => (
              <LoanRow key={record.id} record={record} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <LoansPagination
              pagination={pagination}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
    </div>
  );
}
