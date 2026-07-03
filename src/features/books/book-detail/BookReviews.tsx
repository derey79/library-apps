import { useState } from 'react';
import {
  Calendar,
  MessageSquare,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface Review {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

interface BookReviewsProps {
  reviews: Review[];
}

export default function BookReviews({ reviews }: BookReviewsProps) {
  // 💡 State untuk mengontrol status buka/tutup ekspansi daftar ulasan
  const [isExpanded, setIsExpanded] = useState(false);

  const reviewsList = Array.isArray(reviews) ? reviews : [];

  // 💡 POTONGAN ARRAY: Jika tidak di-expand, hanya tampilkan 6 ulasan pertama (3 baris desktop)
  const displayedReviews = isExpanded ? reviewsList : reviewsList.slice(0, 6);

  return (
    <div className='pt-8 border-t border-neutral-100 space-y-6'>
      {/* JUDUL SECTION */}
      <div className='flex items-center gap-2'>
        <MessageSquare className='h-5 w-5 text-neutral-700' />
        <h2 className='text-lg font-bold text-neutral-950 tracking-tight'>
          User Reviews ({reviewsList.length})
        </h2>
      </div>

      {/* KONDISI JIKA TIDAK ADA ULASAN */}
      {reviewsList.length === 0 ? (
        <p className='text-sm text-neutral-400 font-medium pl-1'>
          No community reviews submitted for this literature node yet.
        </p>
      ) : (
        <div className='space-y-6'>
          {/* GRID DATA REVIEWS (2 KOLOM DESKTOP) */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {displayedReviews.map((review) => {
              const reviewDate = new Date(review.createdAt).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }
              );

              return (
                <div
                  key={review.id}
                  className='p-5 rounded-2xl bg-neutral-50/50 border border-neutral-100 flex flex-col justify-between space-y-3 shadow-sm transition-all duration-300 hover:shadow-md'
                >
                  <div className='space-y-2'>
                    {/* Baris Atas: Nama & Skor Bintang */}
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <div className='h-6 w-6 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-[10px] uppercase'>
                          {review.user?.name?.substring(0, 2) || 'US'}
                        </div>
                        <span className='text-xs font-bold text-neutral-800'>
                          {review.user?.name}
                        </span>
                      </div>
                      <div className='flex items-center gap-0.5'>
                        {Array.from({ length: review.star }).map((_, i) => (
                          <Star
                            key={i}
                            className='h-3 w-3 text-amber-400 fill-amber-400'
                          />
                        ))}
                      </div>
                    </div>
                    {/* Isi Komentar */}
                    <p className='text-xs text-neutral-500 font-normal leading-relaxed whitespace-pre-line pl-0.5'>
                      {review.comment}
                    </p>
                  </div>

                  {/* Tanggal Review */}
                  <div className='flex items-center gap-1 text-[10px] text-neutral-400 font-medium pt-1 border-t border-neutral-100/40 pl-0.5'>
                    <Calendar className='h-2.5 w-2.5' />
                    <span>Reviewed on {reviewDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 💡 TOMBOL LOAD MORE KAPSUL (BENTUK DISESUAIKAN DENGAN CATEGORY) */}
          {reviewsList.length > 6 && (
            <div className='flex justify-center pt-2'>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-200 bg-white text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 shadow-sm transition active:scale-95 cursor-pointer focus:outline-none select-none'
              >
                {isExpanded ? (
                  <>
                    <span>Show Less Reviews</span>
                    <ChevronUp className='h-4 w-4 text-neutral-500' />
                  </>
                ) : (
                  <>
                    <span>
                      Load More Reviews ({reviewsList.length - 6} more)
                    </span>
                    <ChevronDown className='h-4 w-4 text-neutral-500 animate-bounce' />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
