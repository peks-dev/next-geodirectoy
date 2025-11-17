import { z } from 'zod';

// ============================================================================
// SCHEMAS DE VALIDACIÓN
// ============================================================================

/**
 * Schema para validar File del navegador
 * Usado en la validación del formulario (UI → Hook)
 */
const browserFileSchema = z
  .instanceof(File, {
    message: 'Debe ser un archivo válido',
  })
  .refine((file) => file.size > 0, {
    message: 'El archivo no puede estar vacío',
  })
  .refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB
    { message: 'El archivo es demasiado grande (máximo 10MB)' }
  )
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    { message: 'Formato inválido. Solo JPEG, PNG o WebP' }
  );

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
 * Schema para validar imagen comprimida como base64
 * Usado internamente en updateProfileActionSchema
 */
const compressedImageSchema = z.object({
  data: z
    .string()
    .min(1, 'Datos de imagen vacíos')
    .refine(
      (str) => {
        // Validar que sea base64 válido
        try {
          return str.startsWith('data:image/') && str.includes('base64,');
        } catch {
          return false;
        }
      },
      { message: 'Formato de imagen inválido (debe ser base64)' }
    )
    .refine(
      (str) => {
        // Validar tamaño del base64 (aprox. 1.37x el tamaño real del archivo)
        const base64Length = str.split(',')[1]?.length || 0;
        const approxBytes = (base64Length * 3) / 4;
        // Límite de 2MB para el payload de Next.js
        return approxBytes <= 2 * 1024 * 1024;
      },
      { message: 'Imagen demasiado grande después de comprimir (máx 2MB)' }
    ),

  name: z
    .string()
    .min(1, 'Nombre de archivo requerido')
    .max(255, 'Nombre de archivo demasiado largo'),

  type: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    message: 'Tipo de imagen no soportado',
  }),

  size: z
    .number()
    .min(1, 'Tamaño de archivo inválido')
    .max(2 * 1024 * 1024, 'Archivo demasiado grande (máx 2MB)'),
});

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

// ============================================================================
// CONSTANTES
// ============================================================================

export const IMAGE_CONSTRAINTS = {
  /** Tamaño máximo del archivo original antes de comprimir */
  MAX_INPUT_SIZE: 10 * 1024 * 1024, // 10MB
  /** Tamaño objetivo después de comprimir */
  TARGET_SIZE: 200 * 1024, // 200KB
  /** Tamaño máximo del base64 para enviar al servidor */
  MAX_BASE64_SIZE: 2 * 1024 * 1024, // 2MB
  /** Dimensiones máximas para avatares */
  AVATAR_MAX_WIDTH: 512,
  AVATAR_MAX_HEIGHT: 512,
  /** Calidad de compresión JPEG */
  COMPRESSION_QUALITY: 0.85,
  /** Tipos de imagen permitidos */
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
} as const;
