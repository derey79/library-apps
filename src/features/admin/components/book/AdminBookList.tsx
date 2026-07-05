import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axiosInstance from '@/api/axiosInstance';
import { Loader2, Search, Inbox, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

import AdminBookCard, { AdminBookNode } from './AdminBookCard';

interface AdminBooksApiResponse {
  success: boolean;
  message: string;
  data: {
    books: AdminBookNode[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

interface ApiErrorData {
  message?: string;
}

export default function AdminBookList() {
  const { token } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const bookStatusTabs = [
    { id: 'all', label: 'All' },
    { id: 'available', label: 'Available' },
    { id: 'borrowed', label: 'Borrowed' },
    { id: 'returned', label: 'Returned' },
  ];

  // Logika Jeda Pengetikan (Debounce 500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetching Data Daftar Buku Admin via GET /admin/books
  const { data, isLoading, isError } = useQuery<AdminBooksApiResponse>({
    queryKey: [
      'adminBooksManagement',
      currentPage,
      activeStatus,
      debouncedSearch,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/books`, {
        params: {
          page: currentPage,
          limit: 20,
          status: activeStatus, // Memfilter data berdasarkan tab yang aktif
          q: debouncedSearch.trim() || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  // MUTASI UNTUK MENGHAPUS BUKU (DELETE /books/:id)
  const deleteBookMutation = useMutation<
    unknown,
    AxiosError<ApiErrorData>,
    number
  >({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Book entry permanently archived from database.');
      queryClient.invalidateQueries({ queryKey: ['adminBooksManagement'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to execute purge protocol.'
      );
    },
  });

  const displayedBooks = Array.isArray(data?.data?.books)
    ? data.data.books
    : [];
  const pagination = data?.data?.pagination;

  // Handler Aksi Tombol-Tombol Kapsul
  const handlePreviewAction = (id: number) => {
    navigate(`/books/${id}`); // Melempar langsung ke halaman detail buku publik
  };

  const handleEditAction = (book: AdminBookNode) => {
    toast.info(
      `Preparing redirection parameter node for modifying "${book.title}"...`
    );
    // Besok di sini kita hubungkan ke form/modal Edit Buku
  };

  const handleDeleteAction = (id: number, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete "${title}" from catalog inventory?`
      )
    ) {
      deleteBookMutation.mutate(id);
    }
  };

  const handleTabChange = (statusId: string) => {
    setActiveStatus(statusId);
    setCurrentPage(1);
  };

  return (
    <div className='space-y-5 animate-fade-in text-neutral-800 text-left'>
      {/* 💡 1. TOMBOL ADD BOOK KAPSUL UTAMA (PERSIS FIGMA) */}
      <div className='flex justify-start'>
        <button
          type='button'
          onClick={() => navigate('/admin/books/add')} // 💡 Ganti baris toast lama Anda dengan ini
          className='h-11 px-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none select-none active:scale-95'
        >
          <Plus className='h-4 w-4' />
          <span>Add Book</span>
        </button>
      </div>

      {/* 💡 2. BARIS INPUT PENCARIAN SHADCN UI (PERSIS FIGMA) */}
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
          placeholder='Search book'
          className='w-full h-11 pl-11 pr-4 bg-white border border-neutral-200 rounded-full text-sm font-semibold text-neutral-800 placeholder:text-neutral-400 focus-visible:ring-neutral-500/5 focus-visible:border-neutral-300 transition-all shadow-sm'
        />
      </div>

      {/* 💡 3. SUB-FILTER TAB STATUS KAPSUL (PERSIS FIGMA) */}
      <div className='flex flex-wrap items-center gap-2 pb-1'>
        {bookStatusTabs.map((tab) => {
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
        <div className='flex flex-col items-center justify-center py-24 bg-white border border-neutral-100 rounded-[22px] shadow-sm'>
          <Loader2 className='h-7 w-7 text-blue-500 animate-spin' />
          <p className='text-xs font-semibold text-neutral-400 mt-2'>
            Streaming database catalog entities...
          </p>
        </div>
      ) : isError ? (
        <div className='p-8 rounded-2xl bg-red-500/5 border border-red-500/10 text-center'>
          <p className='text-xs font-semibold text-red-400'>
            Failed to sync systemic book ledger registries.
          </p>
        </div>
      ) : displayedBooks.length === 0 ? (
        <div className='p-16 text-center border border-dashed border-neutral-200 bg-neutral-50/40 rounded-[24px] flex flex-col items-center justify-center space-y-2'>
          <Inbox className='h-5 w-5 text-neutral-400' />
          <p className='text-xs text-neutral-500 font-bold'>
            No Catalog Books Discovered
          </p>
        </div>
      ) : (
        /* 💡 4. DAFTAR BARIS KARTU HORIZONTAL REUSABLE COMPONENT (PERSIS FIGMA) */
        <div className='space-y-4'>
          <div className='flex flex-col space-y-3'>
            {displayedBooks.map((book) => (
              <AdminBookCard
                key={book.id}
                book={book}
                onPreview={handlePreviewAction}
                onEdit={handleEditAction}
                onDelete={handleDeleteAction}
              />
            ))}
          </div>

          {/* SIKLUS NAVIGASI PAGINATION */}
          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-center gap-2 pt-4'>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className='px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 transition'
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
                className='px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 transition'
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
