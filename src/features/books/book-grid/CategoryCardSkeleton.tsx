export default function CategoryCardSkeleton() {
  return (
    <div className='w-full bg-white border border-neutral-100 rounded-[20px] p-3 flex flex-col items-start space-y-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] animate-pulse select-none'>
      <div className='w-full aspect-[2.2/1] rounded-[14px] bg-blue-500/4' />

      <div className='h-4 w-20 bg-neutral-200/90 rounded-md ml-1 pb-0.5' />
    </div>
  );
}
