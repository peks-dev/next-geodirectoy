import * as z from 'zod';
import {
  coordinatesSchema,
  serviceSchema,
  scheduleSchema,
  categorySchema,
  imageSchema,
} from './baseSchema';

// Schema ESPECÍFICO para UPDATE
export const updateCommunitySchema = z
  .object({
    // ✅ OBLIGATORIOS
    id: z.string().uuid('ID de comunidad inválido'),
    location: coordinatesSchema, // Requerido (puede actualizarse)
    images: z
      .array(imageSchema)
      .min(2, 'Debe tener entre 2 y 4 imágenes')
      .max(4, 'Debe tener entre 2 y 4 imágenes'),

    // ✅ CAMPOS OBLIGATORIOS (según especificación)
    type: z.enum(['pickup', 'club'], {
      message: 'Tipo de comunidad es requerido',
    }),
    name: z
      .string()
      .min(3, 'Nombre es requerido')
      .max(100, 'Nombre debe tener máximo 100 caracteres'),
    description: z
      .string()
      .min(30, 'Descripción muy corta')
      .max(500, 'Descripción debe tener máximo 500 caracteres'),
    country: z.string().min(1, 'País requerido'),
    state: z.string().min(1, 'Estado requerido'),
    city: z.string().min(1, 'Ciudad requerida'),
    floor_type: z.enum(['cement', 'parquet', 'asphalt', 'synthetic'], {
      message: 'Tipo de piso requerido',
    }),
    is_covered: z.boolean(),
    schedule: z
      .array(scheduleSchema)
      .min(1, 'Debe agregar al menos un horario'),
    services: serviceSchema,

    // ✅ OPCIONALES (dependen de type)
    age_group: z
      .enum(['teens', 'young_adults', 'veterans', 'mixed'])
      .nullable(),
    categories: z.array(categorySchema).nullable(),
  })
  .refine(
    (data) => {
      // Regla de negocio: pickup → age_group + !categories | club → categories + !age_group
      if (data.type === 'pickup') {
        return data.age_group !== null && data.categories === null;
      }
      if (data.type === 'club') {
        return data.categories !== null && data.age_group === null;
      }
      return true;
    },
    {
      message: 'Datos inconsistentes para el tipo de comunidad seleccionado',
      path: ['type'],
    }
  );

export type UpdateCommunityFormData = z.infer<typeof updateCommunitySchema>;
