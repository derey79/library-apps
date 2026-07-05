import { BookOpen } from 'lucide-react';
import { CartItem } from '@/store/slices/cartSlice';

interface CheckoutBookRowProps {
  item: CartItem;
}

export default function CheckoutBookRow({ item }: CheckoutBookRowProps) {
  return (
    <div className='flex items-center gap-4 py-4 border-b border-neutral-100 last:border-0 text-left'>
      <div className='h-24 w-18 rounded-xl bg-neutral-50 border border-neutral-200/60 overflow-hidden shrink-0 shadow-sm flex items-center justify-center'>
        {item.coverImage ? (
          <img
            src={item.coverImage}
            alt={item.title}
            className='w-full h-full object-cover'
          />
        ) : (
          <BookOpen className='h-5 w-5 text-neutral-400' />
        )}
      </div>
      <div className='space-y-1 min-w-0 flex-1'>
        <span className='inline-block px-2 py-0.5 bg-neutral-50 border border-neutral-200 text-neutral-500 rounded text-[9px] font-bold uppercase tracking-wide'>
          Category
        </span>
        <h3 className='font-extrabold text-neutral-950 text-sm leading-tight truncate'>
          {item.title}
        </h3>
        <p className='text-xs text-neutral-400 font-medium truncate'>
          {item.authorName}
        </p>
      </div>
    </div>
  );
}
