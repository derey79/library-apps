import { Link } from 'react-router-dom';

// 💡 PERBARUI INTERFACE: Daftarkan objek category agar dikenali oleh filter file utama
export interface CatalogBookNode {
  id: number;
  title: string;
  coverImage: string;
  rating: number;
  author: { name: string };
  category?: { name: string }; // 💡 TAMBAHKAN BARIS PARAMETER OPSIONAL INI
}

interface BookItemCardProps {
  book: CatalogBookNode;
}

export default function BookItemCard({ book }: BookItemCardProps) {
  return (
    <Link to={`/books/${book.id}`} className='block group focus:outline-none'>
      <div className='flex flex-col bg-white border border-neutral-100 rounded-[22px] p-3 shadow-sm hover:shadow-md transition duration-300 space-y-3 text-left'>
        {/* AREA COVER BUKU */}
        <div className='relative aspect-3/4 w-full bg-neutral-50 rounded-[16px] overflow-hidden border border-neutral-100 flex items-center justify-center shadow-inner group-hover:scale-[1.01] transition-transform duration-200'>
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className='w-full h-full object-cover'
            />
          ) : (
            <span className='text-xs text-neutral-400'>No Image</span>
          )}
        </div>

        {/* METADATA BUKU */}
        <div className='px-1 pb-1 space-y-1'>
          <h3 className='font-extrabold text-neutral-900 text-sm leading-tight truncate group-hover:text-blue-600 transition-colors'>
            {book.title || 'Book Name'}
          </h3>
          <p className='text-[11px] text-neutral-400 font-medium truncate'>
            {book.author?.name || 'Author name'}
          </p>
          <div className='flex items-center gap-1 text-[11px] font-bold text-neutral-800 pt-0.5'>
            <span className='text-amber-400'>★</span>
            <span>{book.rating ? `${book.rating}.0` : '4.9'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
