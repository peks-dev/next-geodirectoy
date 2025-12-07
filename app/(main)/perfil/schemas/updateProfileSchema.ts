import { z } from 'zod';

import {
  browserFileSchema,
  compressedImageSchema,
} from '@/lib/schemas/image-schemas';

/**
 * Schema para validar datos del formulario
 * Usado en: UI → Hook
 *
 * Valida los datos crudos que vienen del formulario antes de procesarlos
 */
export const updateProfileFormSchema = z
  .object({
    name: z
      .string({ message: 'El nombre debe ser texto' })
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre debe tener menos de 100 caracteres')
      .trim()
      .optional(),
    avatarFile: browserFileSchema.optional(),
    userId: z
      .string({ message: 'El ID de usuario debe ser texto' })
      .uuid('ID de usuario inválido'),
  })
  .refine(
    (data) => {
      const hasName = data.name && data.name.length > 0;
      const hasAvatar = data.avatarFile !== undefined;
      return hasName || hasAvatar;
    },
    {
      message: 'Debes cambiar al menos el nombre o el avatar',
      path: ['name'],
    }
  );

export type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>;

/**
 * Schema para validar datos que se envían al server action
 * Usado en: Hook → Server Action
 *
 * Valida los datos ya procesados (imagen comprimida a base64)
 */
export const updateProfileActionSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre debe tener menos de 100 caracteres')
    .trim()
    .refine(
      (str) => {
        // Validar caracteres permitidos (letras, espacios, guiones, apóstrofes)
        const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
        return nameRegex.test(str);
      },
      {
        message:
          'El nombre solo puede contener letras, espacios, guiones y apóstrofes',
      }
    )
    .optional(),

  userId: z.string().uuid('ID de usuario inválido'),

  compressedAvatar: compressedImageSchema.optional(),
});

export type UpdateProfileActionInput = z.infer<
  typeof updateProfileActionSchema
>;

/**
 * Schema usado en el servidor para validación final
 * Incluye todas las validaciones anteriores + verificaciones de seguridad
 */
export const updateProfileServerSchema = updateProfileActionSchema.refine(
  (data) => {
    // Validación adicional: Si hay avatar, el tamaño debe ser razonable
    if (data.compressedAvatar) {
      return data.compressedAvatar.size <= 2 * 1024 * 1024;
    }
    return true;
  },
  { message: 'Imagen demasiado grande para procesar' }
);

export type UpdateProfileServerInput = z.infer<
  typeof updateProfileServerSchema
>;
