import { Star, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Book {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  categoryId: number;
  author: { name: string };
  category: { name: string };
}

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const isAvailable = book.availableCopies > 0;

  return (
    <Link to={`/books/${book.id}`} className='block h-full'>
      <div className='flex flex-col border-0 rounded-2xl p-3 hover:border-zinc-700 hover:bg-zinc-900/90 transition-all duration-300 group cursor-pointer shadow-xl justify-between min-h-97.5'>
        <div className='space-y-3'>
          <div className='relative aspect-3/4 w-full rounded-xl overflow-hidden shadow-inner border flex items-center justify-center group-hover:scale-[1.01] transition-transform'>
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className='object-cover w-full h-full'
                loading='lazy'
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://unsplash.com';
                }}
              />
            ) : (
              <span className='text-xs'>No Image</span>
            )}

            <span
              className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${
                isAvailable
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {isAvailable ? (
                <CheckCircle className='h-2.5 w-2.5' />
              ) : (
                <XCircle className='h-2.5 w-2.5' />
              )}
              {isAvailable
                ? `${book.availableCopies} Available`
                : 'Out of Stock'}
            </span>
          </div>

          <span className='inline-block text-[10px] font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10'>
            {book.category?.name}
          </span>

          <div className='space-y-1'>
            <h3 className='font-bold group-hover:text-blue-400 transition-colors text-lg tracking-tight line-clamp-2 leading-snug'>
              {book.title}
            </h3>
            <p className='text-md text-neutral-400 truncate'>
              by <span className='font-medium'>{book.author?.name}</span>
            </p>
          </div>
        </div>

        {/* 2. AREA BAWAH: Rating & Tombol Aksi */}
        <div className='pt-3 mt-4 space-y-2.5'>
          <div className='flex items-center justify-between text-xs text-zinc-400 font-medium'>
            <div className='flex items-center gap-1'>
              <Star className='h-3.5 w-3.5 text-amber-400 fill-amber-400' />
              <span className='text-zinc-200 font-bold'>{book.rating}</span>
              <span className='text-[10px] text-zinc-500'>
                ({book.reviewCount})
              </span>
            </div>
            <span className='font-mono text-zinc-500 text-[11px]'>
              {book.publishedYear}
            </span>
          </div>

          {/* Tombol Detail Action */}
          <button className='w-full h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] transition-all font-semibold text-xs text-zinc-200 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none'>
            View Matrix
            <ArrowUpRight className='h-3.5 w-3.5 text-zinc-400' />
          </button>
        </div>
      </div>
    </Link>
  );
}
