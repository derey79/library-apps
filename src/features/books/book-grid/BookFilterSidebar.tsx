import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { Loader2 } from 'lucide-react';

interface CategoryNode {
  id: number;
  name: string;
}

interface CategoriesApiResponse {
  success: boolean;
  message: string;
  data: {
    categories: CategoryNode[];
  };
}

interface BookFilterSidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (name: string | null) => void;
  selectedRating: number | null;
  onRatingSelect: (rating: number | null) => void;
}

export default function BookFilterSidebar({
  selectedCategory,
  onCategorySelect,
  selectedRating,
  onRatingSelect,
}: BookFilterSidebarProps) {
  // 💡 AMBIL DATA KATEGORI DINAMIS: Menarik list genre asli dari database Railway Anda
  const { data, isLoading } = useQuery<CategoriesApiResponse>({
    queryKey: ['publicCatalogCategories'],
    queryFn: async () => {
      const response = await axiosInstance.get('/categories');
      return response.data;
    },
  });

  const categoriesList = data?.data?.categories || [];

  // 💡 WARISAN FIGMA: Mengurutkan list rating dari bintang 5 ke bintang 1 (kebawah)
  const ratingsList = [5, 4, 3, 2, 1];

  return (
    <div className='w-full md:w-64 bg-white border border-neutral-100 rounded-[22px] p-6 shadow-sm space-y-6 text-left shrink-0 h-fit'>
      {/* SEKSI 1: FILTER KATEGORI */}
      <div>
        <h3 className='text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1'>
          Filter
        </h3>
        <h4 className='text-sm font-extrabold text-neutral-950'>Category</h4>

        {isLoading ? (
          /* Indikator Loading khusus untuk Sidebar Kategori */
          <div className='flex items-center gap-2 pt-3 text-neutral-400'>
            <Loader2 className='h-3.5 w-3.5 animate-spin text-blue-500' />
            <span className='text-[11px] font-semibold'>
              Indexing genres...
            </span>
          </div>
        ) : (
          <div className='mt-3 space-y-2.5'>
            {categoriesList.map((cat) => {
              const isChecked =
                selectedCategory?.toLowerCase() === cat.name.toLowerCase();
              return (
                <label
                  key={cat.id}
                  className='flex items-center gap-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer select-none transition-colors'
                >
                  <input
                    type='checkbox'
                    checked={isChecked}
                    onChange={() =>
                      onCategorySelect(isChecked ? null : cat.name)
                    }
                    className='h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer'
                  />
                  <span>{cat.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* GARIS PEMBATAS TIPIS FIGMA */}
      <div className='h-px bg-neutral-100 w-full' />

      {/* SEKSI 2: FILTER RATING BINTANG */}
      <div>
        <h4 className='text-sm font-extrabold text-neutral-950'>Rating</h4>

        <div className='mt-3 space-y-2.5'>
          {ratingsList.map((star) => {
            const isChecked = selectedRating === star;
            return (
              <label
                key={star}
                className='flex items-center gap-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer select-none transition-colors'
              >
                <input
                  type='checkbox'
                  checked={isChecked}
                  onChange={() => onRatingSelect(isChecked ? null : star)}
                  className='h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer'
                />
                {/* Visual Bintang Kuning Emas */}
                <span className='text-amber-400 text-sm leading-none'>★</span>
                <span className='font-mono'>{star}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
