// import { useState } from "react";
import { useSearchParams } from 'react-router-dom';
import MyLoans from '@/features/loans/MyLoans';
// Sediakan placeholder atau impor komponen jika sudah ada
import EditProfileForm from '@/features/profile/EditProfileForm';

export default function UserProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Mengambil tab aktif dari URL (?tab=profile/borrowed/reviews), default ke 'borrowed' sesuai gambar
  const activeTab = searchParams.get('tab') || 'borrowed';

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'borrowed', label: 'Borrowed List' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const handleTabChange = (tabId: string) => {
    searchParams.set('tab', tabId);
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className='w-full space-y-8 animate-fade-in pb-12'>
      {/* 💡 CONTAINER TAB KAPSUL MELAYANG (PERSIS SESUAI GAMBAR REFERENSI) */}
      <div className='flex justify-center w-full max-w-2xl mx-auto pt-2'>
        <div className='flex items-center w-full bg-[#F4F4F5] border border-neutral-200/50 rounded-full p-1.5 shadow-sm'>
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 text-center py-2.5 rounded-full text-sm transition-all duration-300 select-none cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'bg-white text-neutral-900 font-bold shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-neutral-100'
                    : 'text-neutral-500 font-semibold hover:text-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* AREA KONTEN UTAMA YANG REAKTIF SESUAI TAB YANG DIKLIK */}
      <div className='w-full transition-all duration-300'>
        {activeTab === 'profile' && (
          <div className='p-6 bg-white border border-neutral-100 rounded-[24px] shadow-sm'>
            {/* Panggil form edit profile Anda di sini */}
            <EditProfileForm />
          </div>
        )}

        {activeTab === 'borrowed' && (
          /* Memanggil kembali komponen MyLoans modular yang sudah selesai kemarin */
          <MyLoans />
        )}

        {activeTab === 'reviews' && (
          <div className='p-6 bg-white border border-neutral-100 rounded-[24px] shadow-sm'>
            <h2 className='text-lg font-bold text-neutral-950'>
              My Book Reviews
            </h2>
            <p className='text-xs text-neutral-400 mt-1'>
              Under construction: List of your submitted book responses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
