import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CategoryCardSkeleton from '../book-grid/CategoryCardSkeleton';

// icon from asset
import fictionIcon from '@/assets/fiction.png';
import nonFictionIcon from '@/assets/non-fiction.png';
import financeIcon from '@/assets/finance.png';
import scienceIcon from '@/assets/science.png';
import educationIcon from '@/assets/education.png';
import selfIcon from '@/assets/self-improv.png';

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

const categoryIcons = {
  fiction: fictionIcon,
  nonfiction: nonFictionIcon,
  selfimprovment: selfIcon,
  finance: financeIcon,
  science: scienceIcon,
  education: educationIcon,
  default: selfIcon,
};

const getCategoryIcon = (name: string) => {
  const normName = name.toLowerCase();

  let icon = categoryIcons.default;

  if (normName.includes('fiction') && !normName.includes('non'))
    icon = categoryIcons.fiction;
  else if (normName.includes('non-fiction')) icon = categoryIcons.nonfiction;
  else if (normName.includes('finance')) icon = categoryIcons.finance;
  else if (normName.includes('self-improvment'))
    icon = categoryIcons.selfimprovment;
  else if (normName.includes('science')) icon = categoryIcons.science;
  else if (normName.includes('education') || normName.includes('study'))
    icon = categoryIcons.education;

  return <img src={icon} alt={name} className='h-11 w-11 object-contain' />;
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
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full'>
        {Array.from({ length: 6 }).map((_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
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
      <div className='flex items-center justify-between pt-4'>
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
          <div className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 transition-all duration-500'>
            {displayedCategories.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              return (
                <div
                  key={category.id}
                  onClick={() =>
                    onSelectCategory(isSelected ? null : category.id)
                  }
                  className={`flex flex-col bg-white border rounded-[20px] p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group h-33.75 justify-between ${
                    isSelected
                      ? 'border-blue-500 ring-4 ring-blue-500/10 bg-blue-50/5'
                      : 'border-neutral-100'
                  }`}
                >
                  <div className='w-full h-16 bg-[#EBF2FF] rounded-[14px] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300'>
                    {getCategoryIcon(category.name)}
                  </div>
                  <div className='pt-2'>
                    <span className='text-xs md:text-md font-bold tracking-tight block truncate text-left pl-0.5'>
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
