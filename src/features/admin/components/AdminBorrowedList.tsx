import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axiosInstance from '@/api/axiosInstance';
import { Loader2, Search, Inbox } from 'lucide-react';
import { Input } from '@/components/ui/input';

import LoanItemCard from '@/features/loans/components/LoanItemCard';

import { AdminLoansApiResponse } from '@/types/types';

export default function AdminBorrowedList() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // 💡 AKTIF KEMBALI: Variabel ini sekarang digunakan penuh oleh deretan tab kapsul di bawah
  const [activeStatus, setActiveStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'returned', label: 'Returned' },
    { id: 'overdue', label: 'Overdue' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError } = useQuery<AdminLoansApiResponse>({
    queryKey: [
      'adminBorrowedManagement',
      currentPage,
      activeStatus,
      debouncedSearch,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/loans`, {
        params: {
          page: currentPage,
          limit: 10,
          status: activeStatus,
          q: debouncedSearch.trim() || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const loansList = data?.data?.loans || [];
  const pagination = data?.data?.pagination;

  const handleTabChange = (statusId: string) => {
    setActiveStatus(statusId); // 💡 DIGUNAKAN DI SINI: Mengubah filter kategori data di server
    setCurrentPage(1);
  };

  return (
    <div className='space-y-5 animate-fade-in text-neutral-800 text-left w-full'>
      {/* BILAH INPUT PENCARIAN */}
      <div className='relative max-w-md w-full'>
        <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400 pointer-events-none z-10'>
          <Search className='h-4 w-4' />
        </span>
        <Input
          type='text'
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder='Search book title, or borrower name...'
          className='w-full h-11 pl-11 pr-4 bg-white border border-neutral-200 rounded-full text-sm font-semibold text-neutral-800 placeholder:text-neutral-400 focus-visible:ring-neutral-500/5 focus-visible:border-neutral-300 transition-all shadow-sm'
        />
      </div>

      {/* 💡 DIKEMBALIKAN: LOOP FILTER TAB KAPSUL REAKTIF SECARA UTUH SESUAI FIGMA */}
      <div className='flex flex-wrap items-center gap-2 pb-1'>
        {statusTabs.map((tab) => {
          const isSelected = activeStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition select-none cursor-pointer focus:outline-none border ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* REACTION VIEW KONDISIONAL */}
      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-24 bg-white border border-neutral-100 rounded-[22px] shadow-sm w-full'>
          <Loader2 className='h-7 w-7 text-blue-500 animate-spin' />
          <p className='text-xs font-semibold text-neutral-400 mt-2'>
            Streaming global sirculation ledgers...
          </p>
        </div>
      ) : isError ? (
        <div className='p-8 rounded-2xl bg-red-500/5 border border-red-500/10 text-center w-full'>
          <p className='text-xs font-semibold text-red-400'>
            Failed to sync systemic borrowing data pools.
          </p>
        </div>
      ) : loansList.length === 0 ? (
        <div className='p-16 text-center border border-dashed border-neutral-200 bg-neutral-50/40 rounded-[24px] flex flex-col items-center justify-center space-y-2 w-full'>
          <Inbox className='h-5 w-5 text-neutral-400' />
          <p className='text-xs text-neutral-500 font-bold'>
            No Transaction Records Found
          </p>
        </div>
      ) : (
        /* KELOMPOK BARIS KARTU KONTEN UTAMA UNIVERSAL */
        <div className='space-y-4 w-full'>
          <div className='flex flex-col space-y-3.5 w-full'>
            {loansList.map((loan) => (
              <LoanItemCard key={loan.id} loan={loan} variant='ADMIN' />
            ))}
          </div>

          {/* SIKLUS NAVIGASI PAGINATION TABEL */}
          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-center gap-2 pt-4'>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className='px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 transition cursor-pointer'
              >
                Previous
              </button>
              <span className='text-xs font-mono font-bold text-neutral-400'>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                disabled={currentPage === pagination.totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, pagination.totalPages)
                  )
                }
                className='px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 transition cursor-pointer'
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
