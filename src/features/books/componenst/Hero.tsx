import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function Hero() {
  // Baca status login pengguna
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className='relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 text-white px-6 py-12 md:p-16 shadow-xl'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none' />

      <div className='relative max-w-2xl space-y-6'>
        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400'>
          <BookOpen className='h-3.5 w-3.5 text-blue-400' />
          <span>Welcome to Booky Digital Library</span>
        </div>

        <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight'>
          Discover a World of{' '}
          <span className='bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
            Knowledge
          </span>{' '}
          & Stories.
        </h1>

        <p className='text-md md:text-lg text-zinc-400 font-normal leading-relaxed'>
          Borrow your favorite textbooks, fiction novels, or research journals
          instantly. Manage your active book loans and track analytics all from
          one integrated dashboard workspace.
        </p>

        <div className='flex flex-wrap items-center gap-4 pt-2'>
          {/* 💡 JIKA BELUM LOGIN, TOMBOL AKAN DIARAHKAN KE /login SECARA AMAN */}
          <Link to={isAuthenticated ? '/books' : '/login'}>
            <button className='h-12 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 font-semibold text-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer text-white shadow-lg shadow-blue-500/20'>
              Explore Catalog
              <ArrowRight className='h-4 w-4' />
            </button>
          </Link>

          {isAuthenticated && (
            <Link to='/my-loans'>
              <button className='h-12 px-6 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 font-medium text-sm transition-all active:scale-95 cursor-pointer text-zinc-300'>
                View Active Loans
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
