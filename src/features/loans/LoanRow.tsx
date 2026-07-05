import { BookOpen, Calendar, Clock } from 'lucide-react';
import LoanStatusBadge from './LoanStatusBadge';
import { LoanRowProps } from '@/types/types';

export default function LoanRow({ record }: LoanRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className='w-full border border-neutral-100 p-4 rounded-[22px] shadow-sm hover:shadow-md transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
      <div className='flex items-center gap-4 w-full sm:max-w-[60%]'>
        <div className='h-20 w-14 rounded-lg bg-neutral-100 border border-neutral-200/60 overflow-hidden shrink-0 shadow-inner flex items-center justify-center'>
          {record.book?.coverImage ? (
            <img
              src={record.book.coverImage}
              alt={record.book.title}
              className='object-cover w-full h-full'
            />
          ) : (
            <BookOpen className='h-4 w-4 text-neutral-400' />
          )}
        </div>
        <div className='space-y-1 min-w-0'>
          <h3 className='font-extrabold text-neutral-900 text-[15px] sm:text-base leading-snug truncate'>
            {record.book?.title || 'Untitled Archive Document'}
          </h3>
          <p className='text-xs text-neutral-400 font-medium truncate'>
            by{' '}
            <span className='text-neutral-600 font-semibold'>
              {record.book?.author?.name || 'Anonymous'}
            </span>
          </p>
          <div className='pt-1 block sm:hidden'>
            <LoanStatusBadge status={record.status} />
          </div>
        </div>
      </div>

      {/* TENGAH: DETAIL TANGGAL */}
      <div className='grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-semibold text-neutral-500 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100'>
        <div className='flex items-center gap-1.5'>
          <Calendar className='h-3.5 w-3.5 text-neutral-400' />
          <div>
            <span className='text-[10px] text-neutral-400 font-medium block uppercase tracking-wider'>
              Loan Date
            </span>
            <span className='text-neutral-800 text-[11px] font-bold'>
              {formatDate(record.loanDate)}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-1.5'>
          <Clock className='h-3.5 w-3.5 text-neutral-400' />
          <div>
            <span className='text-[10px] text-neutral-400 font-medium block uppercase tracking-wider'>
              {record.status === 'RETURNED' ? 'Returned On' : 'Return Deadline'}
            </span>
            <span
              className={`text-[11px] font-bold ${record.status === 'OVERDUE' ? 'text-rose-600' : 'text-neutral-800'}`}
            >
              {record.returnDate
                ? formatDate(record.returnDate)
                : formatDate(record.dueDate)}
            </span>
          </div>
        </div>
      </div>

      {/* KANAN: STATUS BADGE (DESKTOP) */}
      <div className='hidden sm:block shrink-0'>
        <LoanStatusBadge status={record.status} />
      </div>
    </div>
  );
}
