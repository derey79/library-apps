import { UploadCloud, FileImage } from 'lucide-react';

interface BookFormCoverProps {
  previewUrl: string | null;
  fileName?: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BookFormCover({
  previewUrl,
  fileName,
  onFileChange,
}: BookFormCoverProps) {
  return (
    <div className='space-y-1.5'>
      <label className='text-sm font-bold text-neutral-900 tracking-tight'>
        Cover Image
      </label>
      <div className='relative w-full border-2 border-dashed border-neutral-200 rounded-[16px] bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300 transition duration-150 flex flex-col items-center justify-center p-6 text-center group min-h-35'>
        {previewUrl ? (
          <div className='flex items-center gap-3 bg-white p-3 border border-neutral-100 rounded-xl shadow-sm max-w-sm'>
            <FileImage className='h-8 w-8 text-blue-500 shrink-0' />
            <div className='text-left min-w-0'>
              <p className='text-xs font-bold text-neutral-900 truncate max-w-50'>
                {fileName}
              </p>
              <span className='text-[10px] text-neutral-400 font-medium'>
                Staged for streaming synchronization
              </span>
            </div>
          </div>
        ) : (
          <div className='space-y-2 flex flex-col items-center select-none'>
            <div className='h-9 w-9 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-500'>
              <UploadCloud className='h-4 w-4' />
            </div>
            <p className='text-xs font-semibold text-blue-600'>
              Click to upload{' '}
              <span className='text-neutral-500 font-medium'>
                or drag and drop
              </span>
            </p>
            <span className='text-[10px] font-bold text-neutral-400 tracking-wide uppercase'>
              PNG or JPG (max. 5mb)
            </span>
          </div>
        )}

        <input
          type='file'
          accept='image/*'
          onChange={onFileChange}
          className='absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10'
        />
      </div>
    </div>
  );
}
