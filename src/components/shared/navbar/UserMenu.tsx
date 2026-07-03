import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  LogOut,
  User,
  BookMarked,
  MessageSquare,
} from 'lucide-react';
import { UserData } from '@/store/slices/authSlice';

interface UserMenuProps {
  user: UserData | null;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 💡 Fungsi Helper untuk mengambil inisial dari nama pengguna
  const getInitials = (name: string | undefined) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      // Ambil huruf pertama dari kata pertama dan kata kedua (cth: "John Doe" -> "JD")
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    // Ambil dua huruf pertama jika hanya satu kata (cth: "Reymond" -> "RE")
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className='flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-neutral-50 transition cursor-pointer select-none focus:outline-none'
      >
        {/* LINGKARAN AVATAR / INISIAL */}
        <div className='h-10 w-10 rounded-full overflow-hidden border border-neutral-200 shrink-0 flex items-center justify-center select-none shadow-sm'>
          {user?.avatarUrl ? (
            /* KONDISI A: JIKA ADA FOTO PROFIL */
            <img
              src={user.avatarUrl}
              alt={user.name}
              className='object-cover w-full h-full'
            />
          ) : (
            /* KONDISI B: 💡 JIKA FOTO PROFIL KOSONG, TAMPILKAN INISIAL NAMA */
            <div className='w-full h-full bg-primary-300 text-white font-bold text-sm tracking-wide flex items-center justify-center uppercase'>
              {getInitials(user?.name)}
            </div>
          )}
        </div>

        <span className='text-[17px] font-semibold text-neutral-900 tracking-tight'>
          {user?.name || 'John Doe'}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-neutral-800 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* MENU FLOATING CARD DROPDOWN */}
      {isProfileOpen && (
        <div className='absolute right-0 mt-3 w-55 bg-white border border-neutral-100 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-3 flex flex-col space-y-1 animate-fade-in z-50'>
          <Link
            to='/profile?tab=profile'
            onClick={() => setIsProfileOpen(false)}
            className='flex items-center gap-3 px-4 py-3 text-[15px] font-bold text-neutral-800 hover:bg-neutral-50 rounded-[16px] transition'
          >
            <User className='h-4 w-4 text-neutral-500' />
            Profile
          </Link>
          <Link
            to='/profile?tab=borrowed'
            onClick={() => setIsProfileOpen(false)}
            className='flex items-center gap-3 px-4 py-3 text-[15px] font-bold text-neutral-800 hover:bg-neutral-50 rounded-[16px] transition'
          >
            <BookMarked className='h-4 w-4 text-neutral-500' />
            Borrowed List
          </Link>
          <Link
            to='/profile?tab=reviews'
            onClick={() => setIsProfileOpen(false)}
            className='flex items-center gap-3 px-4 py-3 text-[15px] font-bold text-neutral-800 hover:bg-neutral-50 rounded-[16px] transition'
          >
            <MessageSquare className='h-4 w-4 text-neutral-500' />
            Reviews
          </Link>
          <div className='h-px bg-neutral-100 my-1 mx-2' />
          <button
            onClick={onLogout}
            className='w-full flex items-center gap-3 px-4 py-3 text-[15px] font-bold text-[#F43F5E] hover:bg-rose-50/50 rounded-[16px] transition text-left cursor-pointer'
          >
            <LogOut className='h-4 w-4' />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
