import { z } from 'zod';

export const createSnippet = z.object({
    title: z.string().trim().min(3),
    content: z.string().trim().min(1),
    alias: z.string().trim().min(1),
});

export const aliasSchema = z.object({
    alias: z.string().trim(),
});

export const updateSnippet = createSnippet.partial();
