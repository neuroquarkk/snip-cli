import { z } from 'zod';

export const authSchema = z.object({
    email: z.email().trim(),
    password: z.string().trim().min(6),
});
