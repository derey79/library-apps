import { useSearchParams } from 'react-router-dom';
import { BookOpen, Users, FolderHeart, History } from 'lucide-react';

import AdminBorrowedList from '@/features/admin/components/AdminBorrowedList';
import AdminUserList from '@/features/admin/components/AdminUserList';
import AdminCategoryList from '@/features/admin/components/AdminCategoryList';
import AdminBookList from '@/features/admin/components/book/AdminBookList';
import Navbar from '@/components/shared/Navbar';

export default function AdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'borrowed';

  const adminTabs = [
    { id: 'borrowed', label: 'Borrowed List', icon: History },
    { id: 'users', label: 'User List', icon: Users },
    { id: 'categories', label: 'Category List', icon: FolderHeart },
    { id: 'books', label: 'Book List', icon: BookOpen },
  ];

  const handleTabChange = (tabId: string) => {
    searchParams.set('tab', tabId);
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className='custom-container mx-auto space-y-8 animate-fade-in pb-12'>
      {/* HEADER DASBOR UTAMA ADMIN */}
      {/* <div className='flex items-center gap-3 border-b border-neutral-100 pb-5'>
        <div className='h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/10'>
          <Shield className='h-5 w-5' />
        </div>
        <div>
          <h1 className='text-2xl font-extrabold text-neutral-950 tracking-tight'>
            Systemic Control Matrix
          </h1>
          <p className='text-xs text-neutral-400 mt-0.5'>
            Root administrative authority panel to oversee global archives,
            users, and compliance logs.
          </p>
        </div>
      </div> */}
      <Navbar />

      {/* 💡 CONTAINER TAB KAPSUL MELAYANG (ADAPTASI PREMIUM DARI USER PROFILE) */}
      <div className='flex justify-center w-full max-w-3xl'>
        <div className='flex items-center w-full bg-[#F4F4F5] border border-neutral-200/50 rounded-full p-1.5 shadow-sm'>
          {adminTabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-300 select-none cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'bg-white text-neutral-900 font-bold shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-neutral-100'
                    : 'text-neutral-500 font-semibold hover:text-neutral-800'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-neutral-400'}`}
                />
                <span className='hidden sm:inline'>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className='w-full transition-all duration-300'>
        {activeTab === 'borrowed' && <AdminBorrowedList />}
        {activeTab === 'users' && <AdminUserList />}
        {activeTab === 'categories' && <AdminCategoryList />}
        {activeTab === 'books' && <AdminBookList />}
      </div>
    </div>
  );
}
