import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, {
      error: "content must contain minimum of 10 characters.",
    })
    .max(300, {
      error: "content cannot exceed 300 characters.",
    }),
});
