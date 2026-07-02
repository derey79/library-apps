import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { useLoginMutation, LoginPayload } from '../hooks/useAuthMutation';

// UI Components Dasar dari Shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // 💡 Menggunakan Label langsung
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Icons
import { Loader2, Mail, Lock, Eye, EyeOff, Library } from 'lucide-react';

// Skema Validasi Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLoginMutation();

  // Inisialisasi React Hook Form standar industri modern
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginPayload) => {
    mutate(values);
  };

  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      {/* Mini Brand Header */}
      <div className='mb-6 flex flex-col items-center space-y-2 text-center'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <Library className='h-6 w-6' />
        </div>
        <h1 className='text-xl font-bold tracking-tight'>E-Library Platform</h1>
      </div>

      <Card className='w-full max-w-md border-muted/60 shadow-xl backdrop-blur-sm bg-card/95'>
        <CardHeader className='space-y-1.5 px-6 pt-6 text-center'>
          <CardTitle className='text-2xl font-bold tracking-tight'>
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your library account
          </CardDescription>
        </CardHeader>

        <CardContent className='p-6 pt-0'>
          {/* Pemicu submit terikat langsung ke hook */}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* FIELD EMAIL */}
            <div className='space-y-2'>
              <Label
                htmlFor='email'
                className={errors.email ? 'text-destructive' : ''}
              >
                Email Address
              </Label>
              <div className='relative flex items-center'>
                <Mail className='absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none' />
                <Input
                  id='email'
                  type='email'
                  placeholder='name@company.com'
                  className={`pl-10 h-10 transition-all ${errors.email ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary/50'}`}
                  disabled={isPending}
                  {...register('email')} // 💡 Registrasi hook form langsung ke input element
                />
              </div>
              {errors.email && (
                <p className='text-xs font-medium text-destructive animate-fade-in'>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* FIELD PASSWORD */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label
                  htmlFor='password'
                  className={errors.password ? 'text-destructive' : ''}
                >
                  Password
                </Label>
                <Link
                  to='/forgot-password'
                  className='text-xs font-medium text-primary hover:underline'
                >
                  Forgot password?
                </Link>
              </div>
              <div className='relative flex items-center'>
                <Lock className='absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none' />
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  className={`pl-10 pr-10 h-10 transition-all ${errors.password ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary/50'}`}
                  disabled={isPending}
                  {...register('password')}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-1 h-8 w-8 text-muted-foreground hover:text-foreground'
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className='text-xs font-medium text-destructive animate-fade-in'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON SUBMIT */}
            <Button
              type='submit'
              className='w-full h-10 font-medium tracking-wide shadow-md mt-2'
              disabled={isPending}
            >
              {isPending ? (
                <div className='flex items-center justify-center space-x-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className='mt-5 text-center text-sm text-muted-foreground'>
            Don't have an account yet?{' '}
            <Link
              to='/register'
              className='font-semibold text-primary hover:underline underline-offset-4'
            >
              Sign up for free
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
