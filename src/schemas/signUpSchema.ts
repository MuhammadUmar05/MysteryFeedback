import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "minimum 2 characters required for username")
  .max(20, "maximum 20 characters required for username")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.email({ error: "invalid email address" }),
  password: z
    .string()
    .min(6, { error: "password must contain at least 6 characters" }),
});
