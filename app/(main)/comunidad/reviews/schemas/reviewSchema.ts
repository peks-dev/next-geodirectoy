import * as z from 'zod';

export const reviewForm = z.object({
  rating: z.number().min(1).max(5, 'La valoración debe estar entre 1 al 5'),
  comment: z.string().min(8).max(250, 'superaste el limite de 250 caracteres'),
  community_id: z.string().min(10).max(36),
});
