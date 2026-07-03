interface BookGridHeaderProps {
  isFiltered: boolean;
  totalBooks: number;
}

export default function BookGridHeader({
  isFiltered,
  totalBooks,
}: BookGridHeaderProps) {
  return (
    <div>
      <h2 className='text-display-lg font-bold tracking-tight'>
        {isFiltered ? 'Filtered Collections' : 'Recommendation'}
      </h2>
      <p className='text-xs text-zinc-400 mt-1'>
        Showing {totalBooks} premium academic literature materials
      </p>
    </div>
  );
}
