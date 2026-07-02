import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import axiosInstance from '@/api/axiosInstance';
import {
  Loader2,
  Shield,
  LogOut,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

interface UsersApiResponse {
  success: boolean;
  message: string;
  data:
    | DashboardUser[]
    | {
        users: DashboardUser[];
        totalPages?: number;
        totalItems?: number;
      };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  // State untuk manajemen paginasi internal
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  // Sertakan variabel [page] ke dalam queryKey agar otomatis fetch ulang saat halaman bergeser
  const { data, isLoading, isError, refetch, isRefetching } =
    useQuery<UsersApiResponse>({
      queryKey: ['adminUsersList', page],
      queryFn: async () => {
        const response = await axiosInstance.get(`/admin/users`, {
          params: {
            page: page,
            limit: limit,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      },
      enabled: !!token,
    });

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out from admin panel');
    navigate('/login');
  };

  // Normalisasi data untuk mengantisipasi variasi struktur respons objek dari backend
  const rawData = data?.data;
  const usersList = Array.isArray(rawData)
    ? rawData
    : rawData &&
        typeof rawData === 'object' &&
        'users' in rawData &&
        Array.isArray(rawData.users)
      ? rawData.users
      : [];

  // Pengecekan sederhana: asumsikan ada halaman berikutnya jika jumlah data mencapai limit penuh
  const hasNextPage = usersList.length === limit;

  return (
    <div className='min-h-screen antialiased'>
      {/* HEADER INTERNAL ADMIN */}
      <header className='border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40'>
        <div className='mx-auto custom-container px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500'>
              <Shield className='h-5 w-5' />
            </div>
            <div>
              <h1 className='text-md font-bold tracking-tight'>
                Admin Workspace
              </h1>
              <p className='text-xs text-zinc-400'>Library Control Center</p>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <span className='text-sm font-medium text-zinc-300'>
              Logged as:{' '}
              <span className='text-amber-500 font-semibold'>{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition cursor-pointer'
            >
              <LogOut className='h-3.5 w-3.5' />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* BODY KONTEN */}
      <main className='mx-auto custom-container px-4 sm:px-6 lg:px-8 py-8 space-y-6'>
        {/* WIDGET STATISTIK RINGKAS */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-6 rounded-2xl border border-zinc-800 flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-xs font-medium uppercase tracking-wider'>
                Users on Current Page
              </p>
              <h3 className='text-3xl font-extrabold tracking-tight'>
                {isLoading ? '...' : usersList.length}
              </h3>
            </div>
            <div className='h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400'>
              <Users className='h-6 w-6' />
            </div>
          </div>
        </div>

        {/* STRUKTUR TABEL LIST USER */}
        <div className='rounded-2xl border border-neutral-300 overflow-hidden shadow-2xl'>
          <div className='p-5 border-b border-zinc-800 flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-bold'>Users</h2>
              <p className='text-xs text-zinc-400'>
                Database listing - Page {page} (Displaying up to {limit} users
                per page)
              </p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              className='h-9 px-3 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition text-zinc-400 flex items-center gap-2 text-xs font-medium cursor-pointer'
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin text-amber-500' : ''}`}
              />
              Reload Data
            </button>
          </div>

          <div className='overflow-x-auto'>
            {isLoading ? (
              <div className='flex flex-col items-center justify-center py-20 space-y-3'>
                <Loader2 className='h-8 w-8 text-amber-500 animate-spin' />
                <p className='text-sm font-medium text-zinc-400'>
                  Fetching user accounts matrix...
                </p>
              </div>
            ) : isError ? (
              <div className='text-center py-16 space-y-2'>
                <p className='text-sm font-medium text-red-400'>
                  Failed to connect to administrative data node.
                </p>
                <p className='text-xs text-zinc-500'>
                  Verify your current bearer authorization session limits.
                </p>
              </div>
            ) : usersList.length === 0 ? (
              <div className='text-center py-16 text-sm text-zinc-500 font-medium'>
                No user accounts discovered on this page.
              </div>
            ) : (
              <>
                <table className='w-full text-left text-sm space-y-3'>
                  <thead>
                    <tr className='border-b border-zinc-800 bg-neutral-200/40 text-xs font-semibold tracking-wider'>
                      <th className='py-3 px-5'>No</th>
                      <th className='py-3 px-5'>Name</th>
                      <th className='py-3 px-5'>Email</th>
                      <th className='py-3 px-5'>Nomor Handphone</th>
                      <th className='py-3 px-5 text-right'>
                        Access Permission
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-zinc-800/60'>
                    {usersList.map((targetUser) => (
                      <tr
                        key={targetUser.id}
                        className='hover:bg-neutral-800/20 transition-colors group'
                      >
                        <td className='py-4 px-5 font-mono text-xs'>
                          #{targetUser.id}
                        </td>
                        <td className='py-4 px-5 font-semibold group-hover:text-white transition-colors'>
                          {targetUser.name}
                        </td>
                        <td className='py-4 px-5 font-normal'>
                          {targetUser.email}
                        </td>
                        <td className='py-4 px-5 font-normal font-mono text-xs'>
                          {targetUser.phone || '-'}
                        </td>
                        <td className='py-4 px-5 text-right'>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              targetUser.role === 'ADMIN'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                            }`}
                          >
                            {targetUser.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* KOMPONEN FOOTER PAGINASI */}
                <div className='p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/50'>
                  <p className='text-xs text-zinc-400'>
                    Showing page{' '}
                    <span className='text-white font-medium'>{page}</span>
                  </p>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1 || isRefetching}
                      className='h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer'
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={!hasNextPage || isRefetching}
                      className='h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer'
                    >
                      <ChevronRight className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
