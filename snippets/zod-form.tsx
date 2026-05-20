/**
 * Zod + react-hook-form — Tipli form şablonu.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});
export type ContactForm = z.infer<typeof ContactSchema>;

export function useContactForm() {
  return useForm<ContactForm>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: '', email: '', message: '' }
  });
}
