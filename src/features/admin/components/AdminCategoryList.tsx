import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axiosInstance from '@/api/axiosInstance';
import { Loader2, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

import CategoryForm from './category/CategoryForm';
import CategoryRow, { CategoryNode } from './category/CategoryRow';

// 💡 1. INTERFACE BERTINGKAT: Harus mencerminkan objek data.categories sesuai JSON asli Anda
interface CategoriesApiResponse {
  success: boolean;
  message: string;
  data: {
    categories: CategoryNode[];
  };
}

interface ApiErrorData {
  message?: string;
}

export default function AdminCategoryList() {
  const { token } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetching Global Kategori List via GET /categories
  const { data, isLoading, isError } = useQuery<CategoriesApiResponse>({
    queryKey: ['adminCategoriesManagement'],
    queryFn: async () => {
      const response = await axiosInstance.get('/categories');
      console.log(response);
      return response.data;
    },
  });

  // 💡 2. PERBARUI DI SINI: Targetkan ke .data.categories agar Array.isArray membaca array aslinya!
  const categoriesList = Array.isArray(data?.data?.categories)
    ? data.data.categories
    : [];

  // MUTASI POST: Menambahkan Kategori Baru
  const addCategoryMutation = useMutation<
    unknown,
    AxiosError<ApiErrorData>,
    { name: string }
  >({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post('/categories', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('New taxonomy classification deployed successfully.');
      setCategoryName('');
      queryClient.invalidateQueries({
        queryKey: ['adminCategoriesManagement'],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to deploy new category.'
      );
    },
  });

  // MUTASI PUT: Memperbarui Nama Kategori
  const updateCategoryMutation = useMutation<
    unknown,
    AxiosError<ApiErrorData>,
    { id: number; name: string }
  >({
    mutationFn: async ({ id, name }) => {
      const response = await axiosInstance.put(
        `/categories/${id}`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Taxonomy metrics updated successfully.');
      setCategoryName('');
      setEditingId(null);
      queryClient.invalidateQueries({
        queryKey: ['adminCategoriesManagement'],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to update target category.'
      );
    },
  });

  // MUTASI DELETE: Menghapus Kategori
  const deleteCategoryMutation = useMutation<
    unknown,
    AxiosError<ApiErrorData>,
    number
  >({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Taxonomy entity purged from system records.');
      queryClient.invalidateQueries({
        queryKey: ['adminCategoriesManagement'],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'Purge protocol rejected by server nodes.'
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category denomination parameter cannot be empty.');
      return;
    }

    if (editingId) {
      updateCategoryMutation.mutate({ id: editingId, name: categoryName });
    } else {
      addCategoryMutation.mutate({ name: categoryName });
    }
  };

  const handleEditTrigger = (category: CategoryNode) => {
    setEditingId(category.id);
    setCategoryName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCategoryName('');
  };

  const handleDeleteTrigger = (id: number, name: string) => {
    if (
      window.confirm(`Are you sure you want to permanently purge "${name}"?`)
    ) {
      deleteCategoryMutation.mutate(id);
    }
  };

  return (
    <div className='space-y-6 animate-fade-in text-neutral-800 text-left border-t border-neutral-100/10 pt-4'>
      {/* Form Input Modular */}
      <CategoryForm
        categoryName={categoryName}
        editingId={editingId}
        isPending={
          addCategoryMutation.isPending || updateCategoryMutation.isPending
        }
        onNameChange={setCategoryName}
        onCancel={handleCancelEdit}
        onSubmit={handleSubmit}
      />

      {/* VIEW KONDISIONAL DAFTAR KATEGORI */}
      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-20 bg-white border border-neutral-100 rounded-2xl shadow-sm'>
          <Loader2 className='h-6 w-6 text-blue-500 animate-spin' />
          <p className='text-xs font-semibold text-neutral-400'>
            Syncing taxonomy nodes...
          </p>
        </div>
      ) : isError ? (
        <div className='p-8 rounded-2xl bg-red-500/5 border border-red-500/10 text-center'>
          <p className='text-xs font-semibold text-red-400'>
            Failed to stream database classification charts.
          </p>
        </div>
      ) : categoriesList.length === 0 ? (
        <div className='p-12 text-center border border-dashed border-neutral-200 bg-neutral-50/40 rounded-2xl flex flex-col items-center justify-center space-y-2'>
          <Inbox className='h-5 w-5 text-neutral-400' />
          <p className='text-xs text-neutral-500 font-bold'>
            No Genre Classifications Archived
          </p>
        </div>
      ) : (
        /* TABEL UTAMA MANAJEMEN KATEGORI */
        <div className='bg-white border border-neutral-200/60 rounded-[20px] shadow-sm overflow-hidden w-full max-w-3xl'>
          <div className='overflow-x-auto w-full'>
            <table className='w-full border-collapse text-left text-sm text-neutral-800'>
              <thead>
                <tr className='border-b border-neutral-100 bg-neutral-50/40 text-xs font-bold text-neutral-900 tracking-tight'>
                  <th className='py-4 px-6 w-16 text-center'>No</th>
                  <th className='py-4 px-4 min-w-50'>Genre Classification</th>
                  <th className='py-4 px-4 min-w-37.5'>Indexed Date</th>
                  <th className='py-4 px-6 w-32 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-neutral-100'>
                {categoriesList.map((category, index) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    index={index}
                    isEditing={editingId === category.id}
                    isDeletePending={deleteCategoryMutation.isPending}
                    onEditTrigger={handleEditTrigger}
                    onDeleteTrigger={handleDeleteTrigger}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
