import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export default function NavLinks() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ambil nilai kata kunci aktif langsung dari URL
  const currentSearch = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(currentSearch);

  // Efek Debounce: Hanya mengubah URL setelah user berhenti mengetik selama 450ms
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (inputValue.trim()) {
        searchParams.set('search', inputValue);
      } else {
        searchParams.delete('search');
      }
      setSearchParams(searchParams, { replace: true });
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, searchParams, setSearchParams]);

  const handleClear = () => {
    setInputValue('');
    searchParams.delete('search');
    setSearchParams(searchParams, { replace: true });
  };

  return (
    /* 
      💡 TRIK UTAMA: Memberikan 'key' berbasis currentSearch memaksa React memperbarui 
      state inputValue secara otomatis jika parameter URL berubah dari luar (seperti navigasi balik),
      tanpa perlu memanggil setState di dalam useEffect lagi.
    */
    <div
      key={currentSearch}
      className='flex items-center justify-center w-full max-w-xl mx-auto px-4'
    >
      <div className='relative flex items-center w-full group'>
        {/* Ikon Kaca Pembesar */}
        <Search className='absolute left-4 h-4 w-4 text-neutral-400 group-focus-within:text-neutral-500 pointer-events-none transition-colors' />

        {/* Kolom Input Search */}
        <input
          type='text'
          placeholder='Search book'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className='w-full h-11 pl-11 pr-10 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-300 focus:ring-4 focus:ring-neutral-500/5 transition-all'
        />

        {/* Tombol Clear Silang */}
        {inputValue && (
          <button
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
