import {z} from "zod";

export const verifySchema = z.object({
    code: z.string().length(6,{error:"verification code must contain only 6 digits"})
})