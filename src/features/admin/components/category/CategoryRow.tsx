import { Edit2, Trash2, FolderHeart } from 'lucide-react';

export interface CategoryNode {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryRowProps {
  category: CategoryNode;
  index: number;
  isEditing: boolean;
  isDeletePending: boolean;
  onEditTrigger: (category: CategoryNode) => void;
  onDeleteTrigger: (id: number, name: string) => void;
}

export default function CategoryRow({
  category,
  index,
  isEditing,
  isDeletePending,
  onEditTrigger,
  onDeleteTrigger,
}: CategoryRowProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <tr
      className={`hover:bg-neutral-50/50 transition-colors font-medium text-neutral-700 ${
        isEditing ? 'bg-blue-500/5 hover:bg-blue-500/5' : ''
      }`}
    >
      <td className='py-4 px-6 text-center font-bold text-neutral-900 text-xs'>
        {index + 1}
      </td>
      <td className='py-4 px-4 font-bold text-neutral-950 text-xs sm:text-sm'>
        <div className='flex items-center gap-2'>
          <FolderHeart className='h-3.5 w-3.5 text-neutral-400' />
          <span>{category.name}</span>
        </div>
      </td>
      <td className='py-4 px-4 text-neutral-500 text-xs font-semibold'>
        {formatDate(category.createdAt)}
      </td>
      <td className='py-4 px-6 text-center'>
        <div className='flex items-center justify-center gap-2'>
          <button
            type='button'
            onClick={() => onEditTrigger(category)}
            className='p-2 rounded-lg border border-neutral-100 bg-neutral-50/50 text-neutral-400 hover:text-blue-600 hover:bg-blue-50/40 hover:border-blue-100 transition cursor-pointer focus:outline-none'
            title='Edit Classification'
          >
            <Edit2 className='h-3.5 w-3.5' />
          </button>
          <button
            type='button'
            onClick={() => onDeleteTrigger(category.id, category.name)}
            disabled={isDeletePending}
            className='p-2 rounded-lg border border-neutral-100 bg-neutral-50/50 text-neutral-400 hover:text-rose-600 hover:bg-rose-50/40 hover:border-rose-100 transition cursor-pointer focus:outline-none disabled:opacity-40'
            title='Purge Classification'
          >
            <Trash2 className='h-3.5 w-3.5' />
          </button>
        </div>
      </td>
    </tr>
  );
}
