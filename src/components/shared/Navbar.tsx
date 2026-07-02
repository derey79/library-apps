import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Ambil status login dan data user dari Redux Store
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const navLinks = [
    { name: 'Browse Books', href: '/books' },
    { name: 'My Loans', href: '/my-loans' },
    { name: 'Profile', href: '/profile' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className='border-b border-neutral-200 shadow-md sticky top-0 z-50 bg-base-background/80 backdrop-blur-md'>
      <div className='custom-container h-20 flex items-center justify-between px-4'>
        {/* LOGO BRAND */}
        <Link to='/' className='flex items-center gap-2 cursor-pointer'>
          <div className='h-8 w-8 rounded-lg bg-slate-400 flex items-center justify-center font-bold text-lg text-white'>
            B
          </div>
          <span className='text-[32px] font-bold tracking-tighter text-neutral-900'>
            Booky
          </span>
        </Link>

        {/* NAVIGATION LINKS (Desktop) - Hanya muncul jika sudah login */}
        {isAuthenticated && (
          <div className='hidden md:flex items-center gap-6'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-md font-medium transition-colors hover:text-neutral-900 ${
                  isActive(link.href)
                    ? 'text-neutral-900 font-semibold'
                    : 'text-neutral-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user?.role === 'ADMIN' && (
              <Link
                to='/admin/dashboard'
                className={`text-md font-medium text-amber-600 hover:text-amber-500 ${
                  isActive('/admin/dashboard')
                    ? 'underline underline-offset-4'
                    : ''
                }`}
              >
                Admin Panel
              </Link>
            )}
          </div>
        )}

        {/* TOMBOL AKSI UTAMA (Desktop) */}
        <div className='hidden md:flex items-center gap-4'>
          {isAuthenticated ? (
            /* KONDISI 1: JIKA USER SUDAH LOGIN (Tampilan teks nama + tombol logout langsung) */
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 bg-neutral-50'>
                <div className='h-6 w-6 rounded-full bg-primary-300 text-white flex items-center justify-center font-bold text-xs uppercase'>
                  {user?.name?.substring(0, 2) || 'US'}
                </div>
                <span className='text-sm font-medium text-neutral-700 max-w-30 truncate'>
                  Hi, {user?.name?.split(' ')[0]}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className='h-12 px-5 border border-destructive text-destructive rounded-full text-md font-medium tracking-wide transition-all hover:bg-destructive/5 active:scale-95 cursor-pointer'
              >
                Log Out
              </button>
            </div>
          ) : (
            /* KONDISI 2: JIKA USER BELUM LOGIN (Gunakan Link Komponen) */
            <>
              <Link to='/login'>
                <button className='w-40 h-12 border border-neutral-300 rounded-[100px] bg-transparent text-neutral-700 text-md font-medium tracking-wide transition-all active:scale-95 cursor-pointer px-4 py-2 hover:bg-neutral-50'>
                  Login
                </button>
              </Link>

              <Link to='/register'>
                <button className='w-40 h-12 px-4 py-2 text-md font-semibold text-white rounded-full bg-primary-300 hover:bg-primary-300/80 transition active:scale-95 cursor-pointer flex items-center justify-center'>
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='md:hidden text-neutral-700 focus:outline-none p-1'
        >
          <svg
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            {isOpen ? (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            ) : (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE NAV DRAWER */}
      {isOpen && (
        <div className='md:hidden border-t border-neutral-200 bg-white px-6 py-4 space-y-3 shadow-inner'>
          {isAuthenticated ? (
            /* Mobile Links jika sudah login */
            <>
              <div className='text-sm font-semibold text-neutral-500 pb-1 border-b border-neutral-100'>
                Logged in as:{' '}
                <span className='text-neutral-800'>{user?.name}</span>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block transition text-sm py-1 ${isActive(link.href) ? 'text-neutral-900 font-bold' : 'text-neutral-600'}`}
                >
                  {link.name}
                </Link>
              ))}
              {user?.role === 'ADMIN' && (
                <Link
                  to='/admin/dashboard'
                  onClick={() => setIsOpen(false)}
                  className='block text-amber-600 text-sm py-1 font-medium'
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className='w-full mt-4 px-4 py-2 text-sm font-semibold rounded-full bg-destructive text-white text-center cursor-pointer'
              >
                Log Out
              </button>
            </>
          ) : (
            /* Mobile Links jika belum login */
            <div className='flex flex-col gap-2 pt-2'>
              <Link
                to='/login'
                onClick={() => setIsOpen(false)}
                className='w-full'
              >
                <button className='w-full h-11 border border-neutral-300 rounded-full text-sm font-medium text-neutral-700'>
                  Login
                </button>
              </Link>
              <Link
                to='/register'
                onClick={() => setIsOpen(false)}
                className='w-full'
              >
                <button className='w-full h-11 bg-primary-300 text-white rounded-full text-sm font-semibold'>
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
