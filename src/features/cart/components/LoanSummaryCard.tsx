import { Loader2 } from 'lucide-react';

interface LoanSummaryCardProps {
  selectedCount: number;
  isPending: boolean;
  onBorrow: () => void;
}

export default function LoanSummaryCard({
  selectedCount,
  isPending,
  onBorrow,
}: LoanSummaryCardProps) {
  return (
    <div className='w-full md:w-80 bg-white border border-neutral-100 rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-6 text-left shrink-0 md:sticky md:top-24 h-fit'>
      <h2 className='text-md font-extrabold text-neutral-950 tracking-tight'>
        Loan Summary
      </h2>

      <div className='flex items-center justify-between text-sm'>
        <span className='font-semibold text-neutral-400'>Total Book</span>
        <span className='font-extrabold text-neutral-950 font-mono'>
          {selectedCount} {selectedCount > 1 ? 'Items' : 'Item'}
        </span>
      </div>

      {/* TOMBOL BORROW BOOK KAPSUL BIRU (PERSIS FIGMA) */}
      <button
        type='button'
        onClick={onBorrow}
        disabled={selectedCount === 0 || isPending}
        className='w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm tracking-wide transition shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer focus:outline-none select-none disabled:bg-neutral-300 disabled:cursor-not-allowed disabled:shadow-none'
      >
        {isPending ? (
          <>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span>Processing...</span>
          </>
        ) : (
          'Borrow Book'
        )}
      </button>
    </div>
  );
}
