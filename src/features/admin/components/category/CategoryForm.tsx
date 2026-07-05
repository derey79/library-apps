import { Loader2, Plus, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CategoryFormProps {
  categoryName: string;
  editingId: number | null;
  isPending: boolean;
  onNameChange: (val: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CategoryForm({
  categoryName,
  editingId,
  isPending,
  onNameChange,
  onCancel,
  onSubmit,
}: CategoryFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className='p-5 bg-white border border-neutral-100 rounded-[22px] shadow-sm flex flex-col sm:flex-row items-center gap-3 w-full max-w-2xl'
    >
      <div className='w-full flex-1'>
        <Input
          type='text'
          value={categoryName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={
            editingId ? 'Update category name...' : 'Enter new category name...'
          }
          className='w-full h-11 px-4 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800 placeholder:text-neutral-400 focus-visible:ring-neutral-500/5 focus-visible:border-neutral-300 transition-all'
        />
      </div>
      <div className='flex items-center gap-2 w-full sm:w-auto justify-end'>
        {editingId && (
          <button
            type='button'
            onClick={onCancel}
            className='h-11 px-4 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-500 hover:text-neutral-800 transition cursor-pointer select-none focus:outline-none'
          >
            Cancel
          </button>
        )}
        <button
          type='submit'
          disabled={isPending}
          className='h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/5 flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-neutral-400 disabled:cursor-not-allowed select-none focus:outline-none'
        >
          {isPending ? (
            <Loader2 className='h-3.5 w-3.5 animate-spin' />
          ) : editingId ? (
            <Edit2 className='h-3.5 w-3.5' />
          ) : (
            <Plus className='h-3.5 w-3.5' />
          )}
          <span>{editingId ? 'Save Changes' : 'Add Category'}</span>
        </button>
      </div>
    </form>
  );
}
