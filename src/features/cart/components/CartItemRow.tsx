import { BookOpen } from 'lucide-react';
import { CartItem } from '@/store/slices/cartSlice';

interface CartItemRowProps {
  item: CartItem;
  isChecked: boolean;
  onToggle: (id: number) => void;
}

export default function CartItemRow({
  item,
  isChecked,
  onToggle,
}: CartItemRowProps) {
  return (
    <div className='w-full flex items-center gap-4 py-5 border-b border-neutral-100 last:border-b-0 text-left animate-fade-in'>
      {/* CHECKBOX INDIVIDU (PERSIS FIGMA) */}
      <input
        type='checkbox'
        checked={isChecked}
        onChange={() => onToggle(item.id)}
        className='h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer'
      />

      {/* COVER BUKU */}
      <div className='h-28 w-20 rounded-xl bg-neutral-50 border border-neutral-200/60 overflow-hidden shrink-0 shadow-sm flex items-center justify-center'>
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

      {/* METADATA INFO BUKU */}
      <div className='space-y-1 min-w-0 flex-1'>
        <span className='inline-block px-2 py-0.5 bg-neutral-50 border border-neutral-200 text-neutral-500 rounded text-[10px] font-bold uppercase tracking-wide'>
          Literature Node
        </span>
        <h3 className='font-extrabold text-neutral-950 text-base leading-tight truncate'>
          {item.title}
        </h3>
        <p className='text-xs text-neutral-400 font-medium truncate'>
          by{' '}
          <span className='text-neutral-600 font-semibold'>
            {item.authorName}
          </span>
        </p>
      </div>
    </div>
  );
}
