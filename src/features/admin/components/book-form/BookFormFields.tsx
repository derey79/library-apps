import { Input } from '@/components/ui/input';

interface DropdownNode {
  id: number;
  name: string;
}

interface BookFormFieldsProps {
  title: string;
  authorId: string; // 💡 Changed from authorName to authorId string
  categoryId: string;
  isbn: string;
  publishedYear: string;
  totalCopies: string;
  description: string;
  categoriesOptions: DropdownNode[];
  authorsOptions: DropdownNode[]; // 💡 Added authors option data array type
  onTitleChange: (val: string) => void;
  onAuthorChange: (val: string) => void; // 💡 Receives selected author ID string
  onCategoryChange: (val: string) => void;
  onIsbnChange: (val: string) => void;
  onYearChange: (val: string) => void;
  onCopiesChange: (val: string) => void;
  onDescChange: (val: string) => void;
}

export default function BookFormFields({
  title,
  authorId,
  categoryId,
  isbn,
  publishedYear,
  totalCopies,
  description,
  categoriesOptions,
  authorsOptions,
  onTitleChange,
  onAuthorChange,
  onCategoryChange,
  onIsbnChange,
  onYearChange,
  onCopiesChange,
  onDescChange,
}: BookFormFieldsProps) {
  return (
    <div className='space-y-5'>
      {/* Title */}
      <div className='space-y-1.5'>
        <label className='text-sm font-bold text-neutral-900 tracking-tight'>
          Title
        </label>
        <Input
          type='text'
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder='e.g., The Psychology of Money'
          className='w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 focus-visible:ring-neutral-500/5 focus-visible:border-neutral-300 transition-all bg-white'
        />
      </div>

      {/* 💡 CHANGER: Swapped input element with structured select dropdown for Authors */}
      <div className='space-y-1.5'>
        <label className='text-sm font-bold text-neutral-900 tracking-tight'>
          Author
        </label>
        <select
          value={authorId}
          onChange={(e) => onAuthorChange(e.target.value)}
          className='w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 bg-white focus:outline-none focus:border-neutral-300 focus:ring-4 focus:ring-neutral-500/5 transition-all cursor-pointer'
        >
          <option value=''>Select Author</option>
          {authorsOptions.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category & ISBN */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <label className='text-sm font-bold text-neutral-900 tracking-tight'>
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className='w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 bg-white focus:outline-none focus:border-neutral-300 focus:ring-4 focus:ring-neutral-500/5 transition-all cursor-pointer'
          >
            <option value=''>Select Category</option>
            {categoriesOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-1.5'>
          <label className='text-sm font-bold text-neutral-900 tracking-tight'>
            ISBN Code
          </label>
          <Input
            type='text'
            value={isbn}
            onChange={(e) => onIsbnChange(e.target.value)}
            placeholder='e.g., 978-0143115266'
            className='w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 focus-visible:ring-neutral-500/5 focus-visible:border-neutral-300 transition-all bg-white'
          />
        </div>
      </div>

      {/* Published Year & Stock */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <label className='text-sm font-bold text-neutral-900 tracking-tight'>
            Published Year
          </label>
          <Input
            type='number'
            value={publishedYear}
            onChange={(e) => onYearChange(e.target.value)}
            placeholder='e.g., 2020'
            className='w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 focus-visible:ring-neutral-500/5 focus-visible:border-neutral-300 transition-all bg-white'
          />
        </div>
        <div className='space-y-1.5'>
          <label className='text-sm font-bold text-neutral-900 tracking-tight'>
            Number of Copies (Stock)
          </label>
          <Input
            type='number'
            value={totalCopies}
            onChange={(e) => onCopiesChange(e.target.value)}
            placeholder='e.g., 5'
            className='w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 focus-visible:ring-neutral-500/5 focus-visible:border-neutral-300 transition-all bg-white'
          />
        </div>
      </div>

      {/* Description */}
      <div className='space-y-1.5'>
        <label className='text-sm font-bold text-neutral-900 tracking-tight'>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescChange(e.target.value)}
          placeholder='Enter book summary descriptions parameters inside this node text block...'
          rows={4}
          className='w-full p-4 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-300 focus:ring-4 focus:ring-neutral-500/5 transition-all bg-white resize-none'
        />
      </div>
    </div>
  );
}
