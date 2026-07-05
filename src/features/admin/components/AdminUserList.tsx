import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axiosInstance from '@/api/axiosInstance';
import { Loader2, Search, Inbox } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface UserNode {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profilePhoto: string | null;
  role: string;
  createdAt: string;
}

interface AdminUsersApiResponse {
  success: boolean;
  message: string;
  data: {
    users: UserNode[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export default function AdminUserList() {
  const { token } = useSelector((state: RootState) => state.auth);

  // State 1: Menampung apa yang sedang diketik user di layar secara instan
  const [searchQuery, setSearchQuery] = useState('');

  // State 2: Menampung kata kunci final setelah dijeda (debounced value)
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  // 💡 LOGIKA DEBOUNCE MURNI (Mencegah Spam Request API)
  useEffect(() => {
    // Set timer untuk menunda pembaruan state debouncedSearch selama 500ms
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    // Bersihkan timer lama jika pengguna masih lanjut mengetik huruf berikutnya
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Data dari Server API /admin/users
  const { data, isLoading, isError } = useQuery<AdminUsersApiResponse>({
    queryKey: ['adminUsersManagement', currentPage, debouncedSearch],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/users`, {
        params: {
          page: currentPage,
          limit: 10,
          q: debouncedSearch.trim() || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const displayedUsers = Array.isArray(data?.data?.users)
    ? data.data.users
    : [];
  const pagination = data?.data?.pagination;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()] || 'Jul';
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  return (
    <div className='space-y-5 animate-fade-in text-neutral-800 text-left'>
      {/* INPUT PENCARIAN SHADCN */}
      <div className='relative max-w-md w-full'>
        <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400 pointer-events-none z-10'>
          <Search className='h-4 w-4' />
        </span>
        <Input
          type='text'
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Balikkan ke halaman 1 setiap mencari nama baru
          }}
          placeholder='Search user'
          className='w-full h-11 pl-11 pr-4 bg-white border border-neutral-200 rounded-full text-sm font-semibold text-neutral-800 placeholder:text-neutral-400 focus-visible:ring-neutral-500/5 focus-visible:border-neutral-300 transition-all shadow-sm'
        />
      </div>

      {/* RENDER VIEW TABEL */}
      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-20 space-y-2 bg-white border border-neutral-100 rounded-2xl shadow-sm'>
          <Loader2 className='h-6 w-6 text-blue-500 animate-spin' />
          <p className='text-xs font-semibold text-neutral-400'>
            Streaming user nodes database...
          </p>
        </div>
      ) : isError ? (
        <div className='p-8 rounded-2xl bg-red-500/5 border border-red-500/10 text-center'>
          <p className='text-xs font-semibold text-red-400'>
            Failed to sync systemic user registry ledger.
          </p>
        </div>
      ) : displayedUsers.length === 0 ? (
        <div className='p-12 text-center border border-dashed border-neutral-200 bg-neutral-50/40 rounded-2xl flex flex-col items-center justify-center space-y-2'>
          <Inbox className='h-5 w-5 text-neutral-400' />
          <p className='text-xs text-neutral-500 font-bold'>
            No Users Found Matching "{debouncedSearch}"
          </p>
        </div>
      ) : (
        <div className='bg-white border border-neutral-200/60 rounded-[20px] shadow-sm overflow-hidden w-full'>
          <div className='overflow-x-auto w-full'>
            <table className='w-full border-collapse text-left text-sm text-neutral-800'>
              <thead>
                <tr className='border-b border-neutral-100 bg-neutral-50/40 text-xs font-bold text-neutral-900 tracking-tight'>
                  <th className='py-4 px-6 w-16 text-center'>No</th>
                  <th className='py-4 px-4 min-w-37.5'>Name</th>
                  <th className='py-4 px-4 min-w-37.5'>Nomor Handphone</th>
                  <th className='py-4 px-4 min-w-45'>Email</th>
                  <th className='py-4 px-6 min-w-40'>Created at</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-neutral-100'>
                {displayedUsers.map((user, index) => {
                  const rowNumber = (currentPage - 1) * 10 + index + 1;
                  return (
                    <tr
                      key={user.id}
                      className='hover:bg-neutral-50/50 transition-colors duration-150 font-medium text-neutral-700'
                    >
                      <td className='py-4 px-6 text-center font-bold text-neutral-900 text-xs'>
                        {rowNumber}
                      </td>
                      <td className='py-4 px-4 font-bold text-neutral-950 text-xs sm:text-sm'>
                        {user.name}
                      </td>
                      <td className='py-4 px-4 font-mono text-neutral-600 text-xs'>
                        {user.phone || '-'}
                      </td>
                      <td className='py-4 px-4 text-neutral-600 text-xs sm:text-sm'>
                        {user.email}
                      </td>
                      <td className='py-4 px-6 text-neutral-500 text-xs font-semibold'>
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-center gap-2 py-4 bg-neutral-50/20 border-t border-neutral-100'>
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
