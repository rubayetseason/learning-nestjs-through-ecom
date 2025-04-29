import { z } from 'zod';

export const SignUpSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

// Types from Zod schemas (auto)
export type SignUpDto = z.infer<typeof SignUpSchema>;
export type SignInDto = z.infer<typeof SignInSchema>;
