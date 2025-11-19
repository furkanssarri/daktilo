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
