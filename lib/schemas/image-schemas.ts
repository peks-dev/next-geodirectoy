import { z } from 'zod';

/**
 * Schema para validar File del navegador
 * Usado en la validación del formulario (UI → Hook)
 */
export const browserFileSchema = z
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
 * Schema para validar imagen comprimida como base64
 * Usado internamente en updateProfileActionSchema
 */
export const compressedImageSchema = z.object({
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
