import Hero from '@/features/books/componenst/Hero';

export default function LandingPage() {
  return (
    <div className='space-y-8 animate-fade-in'>
      {/* Hero section tampil megah di halaman utama secara publik */}
      <Hero />

      {/* Anda bisa menambahkan info grafis atau buku terpopuler di bawah ini nanti */}
      <div className='p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center'>
        <p className='text-zinc-400 text-sm font-medium'>
          Please <span className='text-primary font-semibold'>Sign In</span> to
          browse our complete collection and start borrowing books.
        </p>
      </div>
    </div>
  );
}
