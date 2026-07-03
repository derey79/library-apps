import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axiosInstance from '@/api/axiosInstance';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { updateUser } from '@/store/slices/authSlice';

import ProfileStatsCards from './ProfileStatsCards';
import ProfileFormFields from './ProfileFormFields';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

interface LoanStats {
  borrowed: number;
  late: number;
  returned: number;
  total: number;
}

interface MeApiResponse {
  success: boolean;
  message: string;
  data: {
    profile: UserProfile;
    loanStats: LoanStats;
    reviewsCount: number;
  };
}

interface ApiErrorData {
  message?: string;
}

export default function EditProfileForm() {
  const { token } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // 💡 HANYA gunakan 2 state teks murni ini. Bebas dari masalah variabel gambar terbuang
  const [name, setName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  // FETCH DATA PROFIL (GET /me)
  const { data, isLoading, isError } = useQuery<MeApiResponse>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      const response = await axiosInstance.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const profile = data?.data?.profile;
  const stats = data?.data?.loanStats;

  const activeName = name !== null ? name : profile?.name || '';
  const activePhone = phone !== null ? phone : profile?.phone || '';

  // MUTASI PATCH /me (Hanya mengirimkan objek data teks murni)
  const updateProfileMutation = useMutation<
    unknown,
    AxiosError<ApiErrorData>,
    { name: string; phone: string }
  >({
    mutationFn: async (updatedData) => {
      const response = await axiosInstance.patch('/me', updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      dispatch(
        updateUser({
          name: activeName,
          phone: activePhone,
        })
      );

      toast.success('Profile parameters synchronized successfully.');
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    // 💡 PERBAIKAN: Gunakan AxiosError<ApiErrorData> agar serasi dengan deklarasi mutasi di atas
    onError: (error: AxiosError<ApiErrorData>) => {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to update systemic parameters.';
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeName.trim()) {
      toast.error('Name field constraint cannot be empty.');
      return;
    }
    updateProfileMutation.mutate({ name: activeName, phone: activePhone });
  };

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-16 space-y-3'>
        <Loader2 className='h-6 w-6 text-blue-500 animate-spin' />
        <p className='text-xs font-medium text-zinc-400'>
          Pulling ledger profile parameters...
        </p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className='p-6 rounded-2xl bg-red-500/5 border border-red-500/10 text-center'>
        <p className='text-xs font-medium text-red-400'>
          Failed to stream account identity node.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-8 animate-fade-in text-neutral-800'>
      <ProfileStatsCards stats={stats} />

      <div className='h-[1px] bg-neutral-100 w-full' />

      <ProfileFormFields
        name={activeName}
        phone={activePhone}
        email={profile.email}
        role={profile.role}
        isPending={updateProfileMutation.isPending}
        onNameChange={setName}
        onPhoneChange={setPhone}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
