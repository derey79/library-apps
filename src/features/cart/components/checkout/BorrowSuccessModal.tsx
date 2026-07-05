import { CheckCircle2 } from 'lucide-react';

interface BorrowSuccessModalProps {
  isOpen: boolean;
  returnDateString: string;
  onNavigateToList: () => void;
}

export default function BorrowSuccessModal({
  isOpen,
  returnDateString,
  onNavigateToList,
}: BorrowSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in'>
      {/* KOTAK DIALOG PUTIH PREMIUM */}
      <div className='w-full max-w-lg bg-white rounded-[32px] p-10 md:p-14 text-center shadow-[0_20px_60px_rgba(0,0,0,0.1)] space-y-6 animate-scale-in'>
        {/* 💡 AREA IKON CENTANG BIRU BEROMBAK (PERSIS FIGMA) */}
        <div className='flex justify-center'>
          <div className='relative flex items-center justify-center h-20 w-20 rounded-full bg-blue-500/10 text-blue-600'>
            <CheckCircle2 className='h-10 w-10 fill-blue-600 text-white' />
            {/* Efek Lingkaran Omsila Latar Belakang */}
            <div className='absolute inset-0 rounded-full border border-blue-500/20 scale-125 animate-ping opacity-30' />
            <div className='absolute inset-0 rounded-full border border-blue-500/10 scale-150' />
          </div>
        </div>

        {/* AREA JUDUL DAN DESKRIPSI TEKS KONDISIONAL */}
        <div className='space-y-2'>
          <h2 className='text-2xl font-extrabold text-neutral-950 tracking-tight'>
            Borrowing Successful!
          </h2>
          <p className='text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed max-w-md mx-auto'>
            Your book has been successfully borrowed. Please return it by{' '}
            <span className='text-rose-600 font-extrabold'>
              {returnDateString}
            </span>
          </p>
        </div>

        {/* 💡 TOMBOL NAVIGASI UTAMA KAPSUL BIRU (PERSIS FIGMA) */}
        <div className='pt-2'>
          <button
            type='button'
            onClick={onNavigateToList}
            className='w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm tracking-wide transition shadow-md shadow-blue-500/10 flex items-center justify-center cursor-pointer focus:outline-none select-none'
          >
            See Borrowed List
          </button>
        </div>
      </div>
    </div>
  );
}
