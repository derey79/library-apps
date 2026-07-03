import { Link } from 'react-router-dom';

// 1. Reusable Logo Component
export function NavbarLogo() {
  return (
    <Link to='/' className='flex items-center gap-2 cursor-pointer select-none'>
      <div className='h-8 w-8 rounded-lg bg-slate-400 flex items-center justify-center font-bold text-lg text-white'>
        B
      </div>
      <span className='text-[32px] font-bold tracking-tighter text-neutral-900'>
        Booky
      </span>
    </Link>
  );
}

// 2. Reusable Auth Buttons (Login & Register)
export function AuthButtons({ onActionClick }: { onActionClick?: () => void }) {
  return (
    <>
      <Link to='/login' onClick={onActionClick}>
        <button className='w-40.75 h-12 border border-neutral-300 rounded-[100px] bg-transparent text-neutral-700 text-md font-semibold tracking-wide transition-all active:scale-95 cursor-pointer px-4 py-2 hover:bg-neutral-50'>
          Login
        </button>
      </Link>
      <Link to='/register' onClick={onActionClick}>
        <button className='w-40.75 h-12 px-4 py-2 text-md font-semibold text-white rounded-full bg-primary-300 hover:bg-primary-300/80 transition active:scale-95 cursor-pointer flex items-center justify-center shadow-sm'>
          Register
        </button>
      </Link>
    </>
  );
}
