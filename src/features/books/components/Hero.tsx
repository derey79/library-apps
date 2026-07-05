import MainHero from '@/assets/main-hero.png';

export default function Hero() {
  return (
    <section className='mx-auto w-full custom-container aspect-1200/441 overflow-hidden rounded-3xl px-4'>
      <img
        src={MainHero}
        alt='Hero Welcome Booky'
        className='h-full w-full object-cover object-center'
      />
    </section>
  );
}
