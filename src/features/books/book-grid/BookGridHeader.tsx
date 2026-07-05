import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { BookGridHeaderProps } from '@/types/types';

export default function BookGridHeader({
  isFiltered,
  totalBooks,
}: BookGridHeaderProps) {
  return (
    <div className='w-full flex items-center justify-between border-b border-neutral-100 pb-4 text-left animate-fade-in'>
      <div className='space-y-1'>
        <h2 className='text-display-sm md:text-display-lg font-bold tracking-tight text-neutral-900'>
          {isFiltered ? 'Filtered Collections' : 'Recommendation'}
        </h2>
        <p className='text-xs md:text-md text-zinc-400'>
          Showing{' '}
          <span className='font-mono font-bold text-neutral-800'>
            {totalBooks}
          </span>{' '}
          recomendations
        </p>
      </div>

      {!isFiltered && (
        <Link
          to='/books'
          className='inline-flex items-center gap-1.5 text-md font-bold text-blue-600 hover:text-blue-700 transition select-none group focus:outline-none'
        >
          <span>All Book</span>
          <ArrowRight className='h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform' />
        </Link>
      )}
    </div>
  );
}
