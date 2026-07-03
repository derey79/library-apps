interface PaginationData {
  currentPage: number;
  totalPages: number;
}

interface LoansPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number | ((prev: number) => number)) => void;
}

export default function LoansPagination({
  pagination,
  onPageChange,
}: LoansPaginationProps) {
  return (
    <div className='flex items-center justify-center gap-2 pt-4'>
      <button
        disabled={pagination.currentPage === 1}
        onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
        className='px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50'
      >
        Previous
      </button>
      <span className='text-xs font-mono font-bold text-neutral-500'>
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>
      <button
        disabled={pagination.currentPage === pagination.totalPages}
        onClick={() =>
          onPageChange((prev) => Math.min(prev + 1, pagination.totalPages))
        }
        className='px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50'
      >
        Next
      </button>
    </div>
  );
}
