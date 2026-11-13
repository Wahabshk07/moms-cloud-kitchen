import { z } from 'zod';

const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;

export const phoneSchema = z.string().trim().regex(phoneRegex, 'Enter a valid phone number');

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'Enter your email or phone'),
  password: z.string().min(1, 'Enter your password'),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
  phone: phoneSchema,
  email: z.union([z.literal(''), z.string().trim().email('Enter a valid email')]),
  password: z.string().min(6, 'At least 6 characters'),
});
export type RegisterForm = z.infer<typeof registerSchema>;

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name'),
  phone: phoneSchema,
  address: z.string().trim().min(8, 'Enter your full delivery address'),
  instructions: z.string().trim().max(300, 'Keep it under 300 characters').optional(),
});
export type CheckoutForm = z.infer<typeof checkoutSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
  phone: phoneSchema,
  address: z.string().trim().optional(),
});
export type ProfileForm = z.infer<typeof profileSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Enter a name'),
  description: z
    .string()
    .trim()
    .min(2, 'Enter a description (at least 2 characters)'),
  price: z
    .string()
    .trim()
    .refine((v) => v !== '' && Number.isFinite(Number(v)) && Number(v) > 0, 'Enter a valid price'),
  categoryId: z.string().min(1, 'Choose a category'),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  isPopular: z.boolean(),
});
export type ProductFormValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Enter a name'),
  description: z.string().trim().optional(),
});
export type CategoryForm = z.infer<typeof categorySchema>;
