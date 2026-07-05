import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, UserData } from '@/store/slices/authSlice';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface ApiErrorData {
  message?: string;
}

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation<unknown, AxiosError<ApiErrorData>, RegisterPayload>({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await axiosInstance.post('/auth/register', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Registration Success! Account created. Please log in.');
      navigate('/login');
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      const errorMessage =
        error.response?.data?.message || 'Registration failed.';
      toast.error(errorMessage);
    },
  });
};

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiResponseWrapper {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: UserData;
  };
}

// 💡 MAKSUD ERROR: Pastikan baris ini tertulis 'export const useLoginMutation' secara akurat
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation<
    ApiResponseWrapper,
    AxiosError<ApiErrorData>,
    LoginPayload
  >({
    mutationFn: async (payload: LoginPayload): Promise<ApiResponseWrapper> => {
      const response = await axiosInstance.post('/auth/login', payload);
      return response.data;
    },
    onSuccess: (responseBody: ApiResponseWrapper) => {
      const { token, user } = responseBody.data;
      dispatch(loginSuccess({ token, user }));
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/');
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      const errorMessage =
        error.response?.data?.message || 'Invalid credentials.';
      toast.error(errorMessage);
    },
  });
};
