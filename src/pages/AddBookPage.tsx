import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axiosInstance from '@/api/axiosInstance';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

import BookFormFields from '@/features/admin/components/book-form/BookFormFields';
import BookFormCover from '@/features/admin/components/book-form/BookFormCover';
import { ApiErrorData } from '@/types/types';

interface DropdownNode {
  id: number;
  name: string;
}

interface CategoriesApiResponse {
  data: { categories: DropdownNode[] };
}

interface AuthorsApiResponse {
  data: { authors: DropdownNode[] };
}

export default function AddBookPage() {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);

  // States penampung data formulir
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState(''); // 💡 Stores selected author node primary key ID
  const [categoryId, setCategoryId] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [totalCopies, setTotalCopies] = useState('');
  const [description, setDescription] = useState('');

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. Fetching Opsi Kategori List for Dropdown
  const { data: categoriesData } = useQuery<CategoriesApiResponse>({
    queryKey: ['adminCategoriesManagement'],
    queryFn: async () => {
      const response = await axiosInstance.get('/categories');
      return response.data;
    },
  });

  const { data: authorsData } = useQuery<AuthorsApiResponse>({
    queryKey: ['adminAuthorsManagement'],
    queryFn: async () => {
      const response = await axiosInstance.get('/authors');
      return response.data;
    },
  });

  const categoriesOptions = categoriesData?.data?.categories || [];
  const authorsOptions = authorsData?.data?.authors || []; // 💡 Safely maps the inner array

  // Mutasi POST /books
  const createBookMutation = useMutation<
    unknown,
    AxiosError<ApiErrorData>,
    FormData
  >({
    mutationFn: async (formDataPayload) => {
      const response = await axiosInstance.post('/books', formDataPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('New literature catalog entity allocated successfully.');
      navigate('/admin/dashboard?tab=books');
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to catalog new book entry.'
      );
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !authorId || !categoryId || !isbn.trim()) {
      toast.error('Please fill in all mandatory constraint parameter fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('authorId', authorId);
    formData.append('categoryId', categoryId);
    formData.append('isbn', isbn.trim());
    formData.append('publishedYear', publishedYear || '2024');
    formData.append('totalCopies', totalCopies || '1');
    formData.append('description', description.trim());

    if (coverFile) {
      formData.append('coverImage', coverFile);
    }

    createBookMutation.mutate(formData);
  };

  return (
    <div className='w-full max-w-2xl mx-auto space-y-6 text-neutral-800 text-left animate-fade-in pb-16'>
      {/* Tombol Navigasi Kembali */}
      <button
        onClick={() => navigate('/admin/dashboard?tab=books')}
        className='inline-flex items-center gap-2.5 text-lg font-bold text-neutral-900 select-none cursor-pointer focus:outline-none group tracking-tight'
      >
        <ArrowLeft className='h-5 w-5 group-hover:-translate-x-0.5 transition-transform' />
        <span>Add Book</span>
      </button>

      <form
        onSubmit={handleSubmit}
        className='space-y-5 bg-white p-2 rounded-2xl'
      >
        {/* 1. Fields Teks Modular */}
        <BookFormFields
          title={title}
          authorId={authorId}
          categoryId={categoryId}
          isbn={isbn}
          publishedYear={publishedYear}
          totalCopies={totalCopies}
          description={description}
          categoriesOptions={categoriesOptions}
          authorsOptions={authorsOptions} // 💡 Oper data array authors baru sebagai props ke anak
          onTitleChange={setTitle}
          onAuthorChange={setAuthorId}
          onCategoryChange={setCategoryId}
          onIsbnChange={setIsbn}
          onYearChange={setPublishedYear}
          onCopiesChange={setTotalCopies}
          onDescChange={setDescription}
        />

        {/* 2. Drag & Drop File Cover Modular */}
        <BookFormCover
          previewUrl={previewUrl}
          fileName={coverFile?.name}
          onFileChange={handleFileChange}
        />

        {/* Tombol Save */}
        <div className='pt-4'>
          <button
            type='submit'
            disabled={createBookMutation.isPending}
            className='w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm tracking-wide transition shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer focus:outline-none select-none disabled:bg-neutral-400 disabled:cursor-not-allowed'
          >
            {createBookMutation.isPending ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span>Saving Book Node...</span>
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
