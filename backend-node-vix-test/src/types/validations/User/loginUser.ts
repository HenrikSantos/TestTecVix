import { z } from "zod";

export const loginUserSchema = z
  .object({
    email: z.string().email("Invalid email").optional(),
    username: z.string().min(1, "Username is required").optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.email || data.username, {
    message: "Email or username is required",
    path: ["email"],
  });

export type TLoginUser = z.infer<typeof loginUserSchema>;
