/**
 * AuthForm — Login/Register tek bileşen.
 * Stack: react-hook-form + zod + shadcn/ui + sonner
 */
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Geçerli e-posta gir'),
  password: z.string().min(8, 'En az 8 karakter')
});
type FormData = z.infer<typeof schema>;

export interface AuthFormProps {
  mode?: 'login' | 'register';
  onSubmit?: (data: FormData) => Promise<void>;
}

export function AuthForm({ mode = 'login', onSubmit }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const submit = async (data: FormData) => {
    setLoading(true);
    try {
      await onSubmit?.(data);
      toast.success(mode === 'login' ? 'Giriş başarılı' : 'Kayıt başarılı');
    } catch (e: any) {
      toast.error(e?.message ?? 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 max-w-sm">
      <div>
        <label className="block text-sm font-medium mb-1">E-posta</label>
        <input
          type="email"
          {...register('email')}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Parola</label>
        <input
          type="password"
          {...register('password')}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white rounded-md py-2 disabled:opacity-50"
      >
        {loading ? '...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
      </button>
    </form>
  );
}
