import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRegisterMutation } from '../hooks/useAuthMutation';

// UI Components Dasar dari Shadcn/ui (Tanpa import /form)
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
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const registerSchema = z.object({
  name: z.string().min(2, 'Minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Minimal 10 angka'),
  password: z.string().min(6, 'Minimal 6 karakter'),
});

export const RegisterForm = () => {
  const { mutate, isPending } = useRegisterMutation();

  // Inisialisasi React Hook Form dengan destrukturisasi formState errors
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  });

  return (
    <Card className='w-full max-w-md mx-auto shadow-lg'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-center'>
          Create Account
        </CardTitle>
        <CardDescription className='text-center'>
          Register your account for E-Library
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Hubungkan langsung handler submit ke form HTML asli */}
        <form onSubmit={handleSubmit((v) => mutate(v))} className='space-y-4'>
          {/* FIELD NAME */}
          <div className='space-y-2'>
            <Label
              htmlFor='name'
              className={errors.name ? 'text-destructive' : ''}
            >
              Name
            </Label>
            <Input
              id='name'
              placeholder='John Doe'
              className={
                errors.name
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
              disabled={isPending}
              {...register('name')} // 💡 Registrasi langsung ke react-hook-form
            />
            {errors.name && (
              <p className='text-xs font-medium text-destructive'>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* FIELD EMAIL */}
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className={errors.email ? 'text-destructive' : ''}
            >
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='john@example.com'
              className={
                errors.email
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
              disabled={isPending}
              {...register('email')}
            />
            {errors.email && (
              <p className='text-xs font-medium text-destructive'>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* FIELD PHONE */}
          <div className='space-y-2'>
            <Label
              htmlFor='phone'
              className={errors.phone ? 'text-destructive' : ''}
            >
              Phone
            </Label>
            <Input
              id='phone'
              placeholder='081234...'
              className={
                errors.phone
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
              disabled={isPending}
              {...register('phone')}
            />
            {errors.phone && (
              <p className='text-xs font-medium text-destructive'>
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* FIELD PASSWORD */}
          <div className='space-y-2'>
            <Label
              htmlFor='password'
              className={errors.password ? 'text-destructive' : ''}
            >
              Password
            </Label>
            <Input
              id='password'
              type='password'
              placeholder='••••••••'
              className={
                errors.password
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
              disabled={isPending}
              {...register('password')}
            />
            {errors.password && (
              <p className='text-xs font-medium text-destructive'>
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              'Register'
            )}
          </Button>
        </form>

        <div className='mt-4 text-center text-sm text-muted-foreground'>
          Have an account?{' '}
          <Link to='/login' className='text-primary hover:underline'>
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
