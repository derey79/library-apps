import { Link } from 'react-router-dom';
import mainLogo from '@/assets/main-logo.png';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

import { Button } from '@/components/ui/button';

export function NavbarLogo() {
  const { user } = useSelector((state: RootState) => state.auth);
  const targetDestination = user?.role === 'ADMIN' ? '/admin/dashboard' : '/';

  return (
    <Link
      to={targetDestination}
      className='flex items-center gap-2 cursor-pointer select-none focus:outline-none'
    >
      <div className='h-10.75 w-10.75 flex items-center justify-center'>
        <img
          src={mainLogo}
          alt='Company Logo'
          className='h-full w-auto object-contain'
        />
      </div>
      <span className='hidden md:block text-display-md font-bold tracking-tighter text-neutral-900'>
        Booky
      </span>
    </Link>
  );
}

interface AuthButtonsProps {
  onActionClick?: () => void;
}

export function AuthButtons({ onActionClick }: AuthButtonsProps) {
  return (
    <>
      <Link to='/login' onClick={onActionClick} className='focus:outline-none'>
        <Button
          type='button'
          variant='outline'
          className='w-40.75 h-12 rounded-full border-neutral-300 text-neutral-700 text-md font-semibold tracking-wide hover:bg-neutral-50 active:scale-95 transition-all select-none cursor-pointer'
        >
          Login
        </Button>
      </Link>

      <Link
        to='/register'
        onClick={onActionClick}
        className='focus:outline-none'
      >
        <Button
          type='button'
          variant='default'
          className='w-40.75 h-12 rounded-full bg-primary-300 hover:bg-primary-300/80 text-md font-semibold text-white active:scale-95 transition-all shadow-sm select-none cursor-pointer flex items-center justify-center'
        >
          Register
        </Button>
      </Link>
    </>
  );
}
