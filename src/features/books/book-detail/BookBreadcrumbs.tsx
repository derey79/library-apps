import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BookBreadcrumbsProps {
  title: string;
}

export default function BookBreadcrumbs({ title }: BookBreadcrumbsProps) {
  return (
    <nav className='flex items-center gap-1.5 text-xs font-semibold text-neutral-400 select-none'>
      <Link to='/' className='hover:text-neutral-900 flex items-center gap-1'>
        <Home className='h-3 w-3' />
        Home
      </Link>
      <ChevronRight className='h-3 w-3 text-neutral-300' />
      <span className='text-neutral-400'>Category</span>
      <ChevronRight className='h-3 w-3 text-neutral-300' />
      <span className='text-neutral-900 font-bold truncate max-w-50 sm:max-w-none'>
        {title}
      </span>
    </nav>
  );
}
