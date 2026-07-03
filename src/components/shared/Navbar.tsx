import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { ShoppingBag } from 'lucide-react';
import { User, BookMarked, MessageSquare, LogOut } from 'lucide-react';

// Impor komponen pecahan atomik yang sudah kita buat
import { NavbarLogo, AuthButtons } from './navbar/NavbarComponents';
import NavLinks from './navbar/NavLinks';
import UserMenu from './navbar/UserMenu';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State untuk mengontrol hamburger menu mobile
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/');
  };

  // Menutup menu mobile otomatis jika pengguna mengklik di luar area menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className='border-b border-neutral-100 sticky top-0 z-50 bg-white/80 backdrop-blur-md'>
      <div className='custom-container h-20 flex items-center justify-between px-6 max-w-7xl mx-auto relative'>
        {/* LOGO */}
        <NavbarLogo />

        {/* DESKTOP NAV LINKS */}
        {isAuthenticated && <NavLinks />}

        {/* DESKTOP PROFILE / AUTH BUTTONS */}
        <div className='hidden md:flex items-center gap-5'>
          {isAuthenticated ? (
            <>
              {/* 💡 IKON KERANJANG BELANJA PREMIUM DENGAN BADGE COUNTER */}
              <Link
                to='/cart'
                className='relative p-2.5 rounded-full hover:bg-neutral-50 border border-neutral-100 bg-white transition flex items-center justify-center text-neutral-700 hover:text-neutral-900 group cursor-pointer focus:outline-none select-none'
              >
                <ShoppingBag className='h-5 w-5' />

                {/* Gelembung Penanda Jumlah Buku Aktif di Keranjang */}
                {cartItems.length > 0 && (
                  <span className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center ring-4 ring-white animate-scale-in'>
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* USER PROFILE DROPDOWN */}
              <UserMenu user={user} onLogout={handleLogout} />
            </>
          ) : (
            <AuthButtons />
          )}
        </div>

        {/* MOBILE: HAMBURGER BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='md:hidden text-neutral-800 focus:outline-none p-1 transition-transform active:scale-95 cursor-pointer'
        >
          <svg
            className='h-7 w-7'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* 💡 MOBILE MENU DRAWER: BERBENTUK KARTU FLOATING (PERSIS SESUAI GAMBAR CONTOH) */}
        {isOpen && (
          <div
            ref={mobileMenuRef}
            className='absolute top-18  w-full bg-white border border-neutral-100 rounded-[24px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] p-3 flex flex-col space-y-1 animate-fade-in md:hidden z-50'
          >
            {isAuthenticated ? (
              /* KONDISI 1: MOBILE MENU JIKA USER SUDAH LOGIN */
              <>
                <Link
                  to='/profile'
                  onClick={() => setIsOpen(false)}
                  className='flex items-center gap-3 px-4 py-3.5 text-[15px] font-bold text-neutral-800 hover:bg-neutral-50 rounded-[16px] transition'
                >
                  <User className='h-4 w-4 Lech text-neutral-400' />
                  Profile
                </Link>

                <Link
                  to='/my-loans'
                  onClick={() => setIsOpen(false)}
                  className='flex items-center gap-3 px-4 py-3.5 text-[15px] font-bold text-neutral-800 hover:bg-neutral-50 rounded-[16px] transition'
                >
                  <BookMarked className='h-4 w-4 text-neutral-400' />
                  Borrowed List
                </Link>

                <Link
                  to='/reviews'
                  onClick={() => setIsOpen(false)}
                  className='flex items-center gap-3 px-4 py-3.5 text-[15px] font-bold text-neutral-800 hover:bg-neutral-50 rounded-[16px] transition'
                >
                  <MessageSquare className='h-4 w-4 text-neutral-400' />
                  Reviews
                </Link>

                <div className='h-px bg-neutral-100/70 my-1 mx-2' />

                <button
                  onClick={handleLogout}
                  className='w-full flex items-center gap-3 px-4 py-3.5 text-[15px] font-bold text-[#F43F5E] hover:bg-rose-50/50 rounded-[16px] transition text-left cursor-pointer'
                >
                  <LogOut className='h-4 w-4' />
                  Logout
                </button>
              </>
            ) : (
              /* KONDISI 2: MOBILE MENU JIKA USER BELUM LOGIN */
              <div className='flex flex-col gap-2 p-1'>
                <AuthButtons onActionClick={() => setIsOpen(false)} />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
