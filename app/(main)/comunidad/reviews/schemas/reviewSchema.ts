import * as z from 'zod';

export const reviewForm = z.object({
  rating: z
    .number()
    .min(1, 'debes de seleccionar un puntaje')
    .max(5, 'no puede darle más de 5'),
  comment: z
    .string()
    .min(8, 'debe ser mas largo el comentario')
    .max(250, 'el comentario es muy largo'),
  community_id: z.string().min(10).max(36),
});
