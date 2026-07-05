import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function NavLinks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

  const currentSearch = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(currentSearch);

  // Sinkronisasi data render phase untuk menghindari cascading re-render lint error
  const [lastSearchParam, setLastSearchParam] = useState(currentSearch);
  if (currentSearch !== lastSearchParam) {
    setLastSearchParam(currentSearch);
    setInputValue(currentSearch);
  }

  // DEBOUNCE EFFECT: Murni hanya mengupdate searchParams URL di tempat aktif saat ini
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmedValue = inputValue.trim();

      if (trimmedValue) {
        searchParams.set('search', trimmedValue);
        setSearchParams(searchParams, { replace: true });
      } else {
        if (searchParams.has('search')) {
          searchParams.delete('search');
          setSearchParams(searchParams, { replace: true });
        }
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, searchParams, setSearchParams]);

  const handleClear = () => {
    setInputValue('');
    searchParams.delete('search');
    setSearchParams(searchParams, { replace: true });
  };

  if (user?.role === 'ADMIN') {
    return null;
  }

  return (
    <div className='flex items-center justify-center w-full max-w-xl mx-auto px-4'>
      <div className='relative flex items-center w-full group'>
        <Search className='absolute left-4 h-4 w-4 text-neutral-400 group-focus-within:text-neutral-500 pointer-events-none transition-colors' />
        <Input
          type='text'
          placeholder='Search book'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className='w-full h-11 pl-11 pr-10 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus-visible:ring-neutral-500/5 focus-visible:border-neutral-300 transition-all shadow-sm text-left'
        />
        {inputValue && (
          <button
            type='button'
            onClick={handleClear}
            className='absolute right-3.5 p-1 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition cursor-pointer'
          >
            <X className='h-3.5 w-3.5' />
          </button>
        )}
      </div>
    </div>
  );
}
