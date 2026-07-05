import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { Loader2, BookOpen } from 'lucide-react';
import AuthorIcon from '@/assets/author-avatar.png';

// 1. KONTRAK INTERFACE: Sesuai struktur properti JSON asli backend Railway Anda
interface AuthorNode {
  id: number;
  name: string;
  bio: string | null;
  bookCount: number; // 💡 Menggunakan bookCount murni dari data API Anda
  accumulatedScore: number;
  avatarUrl?: string; // Jaminan opsional jika ada Cloudinary link di masa depan
}

interface PopularAuthorsResponse {
  success: boolean;
  message: string;
  data: {
    authors: AuthorNode[]; // 💡 Struktur dibungkus di dalam objek authors
  };
}

export default function PopularAuthors() {
  // Ambil data penulis terpopuler via GET /authors/popular
  const { data, isLoading, isError } = useQuery<PopularAuthorsResponse>({
    queryKey: ['popularAuthorsDisplay'],
    queryFn: async () => {
      const response = await axiosInstance.get('/authors/popular');
      return response.data;
    },
  });

  // 💡 2. PERBAIKAN EKSTRAKSI DATA: Ambil array langsung dari properti .authors
  const authorsList = data?.data?.authors || [];

  if (isLoading) {
    return (
      <div className='w-full py-16 flex flex-col items-center justify-center space-y-3 bg-white border border-neutral-100/60 rounded-[22px] shadow-sm'>
        <Loader2 className='h-6 w-6 text-blue-500 animate-spin' />
        <p className='text-xs font-semibold text-neutral-400'>
          Loading popular authors ...
        </p>
      </div>
    );
  }

  if (isError || authorsList.length === 0) {
    return null; // Sembunyikan seksi secara aman jika data kosong/error agar layout tidak rusak
  }

  return (
    <div className='w-full text-left space-y-5 pt-8 pb-4 animate-fade-in'>
      {/* JUDUL SEKSI (PERSIS FIGMA) */}
      <h2 className='text-display-lg font-bold tracking-tight text-neutral-900'>
        Popular Authors
      </h2>

      {/* RESPONSIF GRID KARTU PENULIS */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full'>
        {authorsList.slice(0, 4).map((author: AuthorNode) => {
          // Menggunakan generator avatar otomatis yang unik berdasarkan nama penulis
          const defaultAvatar = AuthorIcon;

          return (
            <div
              key={author.id}
              className='bg-white border border-neutral-100 rounded-[18px] p-4 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition duration-300'
            >
              {/* LINGKARAN FOTO PROFIL PENULIS (AVATAR CIRCLE) */}
              <div className='h-14 w-14 rounded-full bg-neutral-50 border border-neutral-100 overflow-hidden shrink-0 shadow-sm flex items-center justify-center'>
                <img
                  src={author.avatarUrl || defaultAvatar}
                  alt={author.name}
                  className='w-full h-full object-cover'
                />
              </div>

              {/* DETAIL BLOK TEKS PENULIS */}
              <div className='space-y-1 min-w-0 text-left'>
                <h3
                  className='font-extrabold text-neutral-950 text-sm leading-tight truncate'
                  title={author.name}
                >
                  {author.name}
                </h3>

                {/* IKON LENCANA STATUS JUMLAH BUKU (BLUE BADGE PERSIS FIGMA STYLE) */}
                <div className='flex items-center gap-1.5 text-xs font-bold text-neutral-500'>
                  <div className='h-4 w-4 bg-blue-600 rounded flex items-center justify-center text-white shrink-0'>
                    <BookOpen className='h-2.5 w-2.5 fill-current' />
                  </div>
                  <span className='truncate'>{author.bookCount} books</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
