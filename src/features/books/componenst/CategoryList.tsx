import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import {
  Loader2,
  Sparkles,
  Scroll,
  Sprout,
  Coins,
  Microscope,
  GraduationCap,
  FolderOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesApiResponse {
  success: boolean;
  message: string;
  data: {
    categories: Category[];
  };
}

interface CategoryListProps {
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

const getCategoryIcon = (name: string) => {
  const normName = name.toLowerCase().trim();
  if (normName.includes('fiction') && !normName.includes('non')) {
    return <Sparkles className='h-6 w-6 text-blue-600 animate-pulse' />;
  }
  if (normName.includes('non-fiction') || normName.includes('scroll')) {
    return <Scroll className='h-6 w-6 text-blue-600' />;
  }
  if (
    normName.includes('self') ||
    normName.includes('lifestyle') ||
    normName.includes('sprout') ||
    normName.includes('improvement')
  ) {
    return <Sprout className='h-6 w-6 text-blue-600' />;
  }
  if (normName.includes('finance') || normName.includes('money')) {
    return <Coins className='h-6 w-6 text-blue-600' />;
  }
  if (normName.includes('science') || normName.includes('technology')) {
    return <Microscope className='h-6 w-6 text-blue-600' />;
  }
  if (normName.includes('education') || normName.includes('study')) {
    return <GraduationCap className='h-6 w-6 text-blue-600' />;
  }
  return <FolderOpen className='h-6 w-6 text-blue-600' />;
};

export default function CategoryList({
  selectedCategoryId,
  onSelectCategory,
}: CategoryListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading, isError } = useQuery<CategoriesApiResponse>({
    queryKey: ['bookCategories'],
    queryFn: async () => {
      const response = await axiosInstance.get('/categories');
      return response.data;
    },
  });

  //check console log
  console.log('Response API Categories:', data);

  const categories = Array.isArray(data?.data?.categories)
    ? data.data.categories
    : [];

  const displayedCategories = isExpanded ? categories : categories.slice(0, 6);

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-12 space-y-3 bg-zinc-900/10 rounded-2xl'>
        <Loader2 className='h-6 w-6 text-blue-500 animate-spin' />
        <p className='text-xs font-medium text-zinc-400'>
          Syncing visualization parameters...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-6 rounded-2xl bg-red-500/5 border border-red-500/10 text-center'>
        <p className='text-xs font-medium text-red-400'>
          Failed to render visual nodes.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full py-2 space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-bold text-white tracking-tight'>
          Browse by Category
        </h2>
        {selectedCategoryId !== null && (
          <button
            onClick={() => onSelectCategory(null)}
            className='text-xs font-semibold text-blue-400 hover:underline cursor-pointer'
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      {categories.length === 0 ? (
        <p className='text-xs text-zinc-500 font-medium'>
          No book categories discovered.
        </p>
      ) : (
        <div className='space-y-6'>
          {/* Grid responsif simetris */}
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 transition-all duration-500'>
            {displayedCategories.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              return (
                <div
                  key={category.id}
                  onClick={() =>
                    onSelectCategory(isSelected ? null : category.id)
                  }
                  className={`flex flex-col bg-white border rounded-[20px] p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group h-33.75 justify-between ${
                    isSelected
                      ? 'border-blue-500 ring-4 ring-blue-500/10 bg-blue-50/5'
                      : 'border-neutral-100'
                  }`}
                >
                  <div className='w-full h-16 bg-[#EBF2FF] rounded-[14px] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300'>
                    {getCategoryIcon(category.name)}
                  </div>
                  <div className='pt-2'>
                    <span className='text-xs sm:text-[13px] font-bold text-neutral-800 tracking-tight block truncate text-left pl-0.5'>
                      {category.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {categories.length > 6 && (
            <div className='flex justify-center pt-2'>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-200 bg-white text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 shadow-sm transition active:scale-95 cursor-pointer focus:outline-none select-none'
              >
                {isExpanded ? (
                  <>
                    <span>Show Less Categories</span>
                    <ChevronUp className='h-4 w-4 text-neutral-500' />
                  </>
                ) : (
                  <>
                    <span>Show All Categories ({categories.length})</span>
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
