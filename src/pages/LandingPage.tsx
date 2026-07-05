import { useState } from 'react';
import Hero from '@/features/books/components/Hero';
import CategoryList from '@/features/books/components/CategoryList';
import BookGrid from '@/features/books/components/BookGrid';
import PopularAuthors from '@/features/books/book-grid/PopularAuthors';

export default function LandingPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  return (
    <div className='space-y-8 animate-fade-in px-4'>
      <Hero />
      <CategoryList
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <BookGrid selectedCategoryId={selectedCategoryId} />
      <PopularAuthors />
      <div className='p-8 rounded-2xl border border-zinc-800/45 text-center'>
        <p className='text-zinc-400 text-sm font-medium'>
          Discover inspiring stories & timeless knowledge, ready to borrow
          anytime. Explore online or visit our nearest library branch.
        </p>
      </div>
    </div>
  );
}
