import { Star, BookOpen } from 'lucide-react';

export interface AdminBookNode {
  id: number;
  title: string;
  coverImage: string;
  publishedYear: number;
  rating: number;
  author: { name: string };
  category: { name: string };
}

interface AdminBookCardProps {
  book: AdminBookNode;
  onPreview: (id: number) => void;
  onEdit: (book: AdminBookNode) => void;
  onDelete: (id: number, title: string) => void;
}

export default function AdminBookCard({
  book,
  onPreview,
  onEdit,
  onDelete,
}: AdminBookCardProps) {
  return (
    <div className='w-full bg-white border border-neutral-100 rounded-[22px] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition duration-300 hover:shadow-md text-left'>
      {/* AREA KIRI: COVER, KATEGORI, JUDUL, PENULIS, DAN RATING */}
      <div className='flex items-start gap-5 min-w-0 flex-1'>
        {/* Gambar Sampul Buku */}
        <div className='h-28 w-20 rounded-xl bg-neutral-50 border border-neutral-200/60 overflow-hidden shrink-0 shadow-sm flex items-center justify-center'>
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className='w-full h-full object-cover'
            />
          ) : (
            <BookOpen className='h-5 w-5 text-neutral-400' />
          )}
        </div>

        {/* Konten Metadata Buku */}
        <div className='space-y-1.5 min-w-0'>
          <span className='inline-block px-2.5 py-0.5 bg-neutral-50 border border-neutral-200 text-neutral-600 rounded-md text-[10px] font-bold tracking-wide'>
            {book.category?.name || 'General'}
          </span>
          <h3
            className='font-extrabold text-neutral-950 text-base leading-tight truncate max-w-md sm:max-w-lg'
            title={book.title}
          >
            {book.title}
          </h3>
          <p className='text-xs text-neutral-400 font-medium truncate'>
            {book.author?.name || 'Unknown Author'}
          </p>
          <div className='flex items-center gap-1 text-xs font-bold text-neutral-800 pt-0.5'>
            <Star className='h-3.5 w-3.5 text-amber-400 fill-amber-400' />
            <span>{book.rating ? `${book.rating}.0` : '0.0'}</span>
          </div>
        </div>
      </div>

      {/* AREA KANAN: TOMBOL AKSI CAPSULE (PERSIS SEPERTI FIGMA) */}
      <div className='flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-50 justify-end'>
        <button
          type='button'
          onClick={() => onPreview(book.id)}
          className='h-9 px-4 rounded-full border border-neutral-200 bg-white text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition cursor-pointer focus:outline-none'
        >
          Preview
        </button>
        <button
          type='button'
          onClick={() => onEdit(book)}
          className='h-9 px-4 rounded-full border border-neutral-200 bg-white text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition cursor-pointer focus:outline-none'
        >
          Edit
        </button>
        <button
          type='button'
          onClick={() => onDelete(book.id, book.title)}
          className='h-9 px-4 rounded-full border border-rose-200 bg-white text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50/30 transition cursor-pointer focus:outline-none'
        >
          Delete
        </button>
      </div>
    </div>
  );
}
