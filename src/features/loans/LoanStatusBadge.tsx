interface LoanStatusBadgeProps {
  status: string;
}

export default function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  const normStatus = status.toLowerCase().trim();

  if (normStatus === 'borrowed' || normStatus === 'active') {
    return (
      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20'>
        Borrowed
      </span>
    );
  }
  if (normStatus === 'returned') {
    return (
      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'>
        Returned
      </span>
    );
  }
  if (normStatus === 'overdue') {
    return (
      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 animate-pulse'>
        Overdue
      </span>
    );
  }

  return (
    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-500/10 text-neutral-600 border border-neutral-500/20'>
      {status}
    </span>
  );
}
