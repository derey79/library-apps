import { Link } from 'react-router-dom';
import mainLogo from '@/assets/main-logo.png';
import FacebookIcon from '@/assets/facebook.png';
import InstagramIcon from '@/assets/instagram.png';
import LinkedinIcon from '@/assets/linkedin.png';
import TiktokIcon from '@/assets/tiktok.png';

export default function Footer() {
  // Data jejaring sosial untuk mempermudah perulangan (.map) ikon lingkaran
  const socialMedias = [
    { id: 'facebook', icon: FacebookIcon, url: '#' },
    { id: 'instagram', icon: InstagramIcon, url: '#' },
    { id: 'linkedin', icon: LinkedinIcon, url: '#' },
    { id: 'tiktok', icon: TiktokIcon, url: '#' }, // Bisa diganti ikon TikTok kustom jika sudah ada
  ];

  return (
    <footer className='w-full bg-white border-t border-neutral-100/70 pt-14 pb-10 px-4 text-center mt-auto animate-fade-in'>
      <div className='custom-container mx-auto flex flex-col items-center justify-center space-y-6'>
        <Link
          to='/'
          className='flex items-center justify-center gap-2.5 cursor-pointer select-none focus:outline-none group'
        >
          <div className='h-9 w-9 flex items-center justify-center transition-transform group-hover:scale-105 duration-200'>
            <img
              src={mainLogo}
              alt='Booky Logo'
              className='h-full w-auto object-contain'
            />
          </div>
          <span className='text-xl font-black text-neutral-900 tracking-tight'>
            Booky
          </span>
        </Link>

        <p className='text-sm md:text-[16px]  font-medium w-full leading-relaxed px-2'>
          Discover inspiring stories & timeless knowledge, ready to borrow
          anytime. Explore online or visit our nearest library branch.
        </p>

        <div className='space-y-4 pt-2 flex flex-col items-center justify-center w-full'>
          <span className='text-xs font-bold text-neutral-900 tracking-tight block'>
            Follow on Social Media
          </span>

          <div className='flex items-center justify-center gap-3'>
            {socialMedias.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target='_blank'
                rel='noopener noreferrer'
                className='h-9 w-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-950 hover:text-blue-600 hover:border-blue-500 hover:shadow-sm transition-all duration-200 cursor-pointer focus:outline-none'
              >
                <img
                  src={social.icon}
                  alt={`${social.id} icon`}
                  className='w-full h-full object-contain'
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
