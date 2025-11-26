import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// TypeScript type inferred from schema:
export type SignupFormValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters.")
    .max(30, "Category name must be at most 30 characters."),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const tagSchema = z.object({
  name: z
    .string()
    .min(2, "Tag name must be at least 2 characters.")
    .max(30, "Tag name must be at most 30 characters."),
});

export type TagFormValues = z.infer<typeof tagSchema>;
