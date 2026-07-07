export default function BookCardSkeleton() {
  return (
    /* Efek animate-pulse adalah utility bawaan Tailwind untuk membuat animasi memudar-menajam yang halus */
    <div className='w-full bg-white border border-neutral-100 rounded-[22px] p-3 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] animate-pulse select-none'>
      {/* AREA COVER BUKU SKELETON */}
      <div className='aspect-3/4 w-full rounded-xl bg-neutral-200/70' />

      {/* AREA TEXT DETAIL SKELETON */}
      <div className='space-y-2.5 px-1 pb-1 text-left'>
        {/* Kapsul Genre/Category */}
        <div className='h-3 w-16 bg-neutral-200 rounded-md' />

        {/* Judul Buku (Baris 1 tebal & panjang) */}
        <div className='h-4.5 w-11/12 bg-neutral-200/90 rounded-md' />

        {/* Kelanjutan Judul Buku (Baris 2 lebih pendek jika judul panjang) */}
        <div className='h-4.5 w-2/3 bg-neutral-200/90 rounded-md' />

        {/* Nama Penulis / Author */}
        <div className='h-3 w-1/2 bg-neutral-200/70 rounded-md pt-1' />

        {/* Rating Bintang & Sisa Stok Row */}
        <div className='flex items-center justify-between pt-2'>
          {/* Blok Rating */}
          <div className='h-3 w-12 bg-neutral-200/60 rounded-md' />
          {/* Blok Sisa Stok */}
          <div className='h-3 w-14 bg-neutral-200/60 rounded-md' />
        </div>
      </div>
    </div>
  );
}
