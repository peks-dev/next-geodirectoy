import * as z from 'zod';
import {
  coordinatesSchema,
  serviceSchema,
  scheduleSchema,
  categorySchema,
  imageSchema,
} from './baseSchema';

// Schema ESPECÍFICO para REGISTER
export const registerCommunitySchema = z
  .object({
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
    location: coordinatesSchema,
    images: z
      .array(imageSchema)
      .min(2, 'Debe subir mínimo 2 imágenes')
      .max(4, 'Puede subir máximo 4 imágenes'),
    schedule: z
      .array(scheduleSchema)
      .min(1, 'Debe agregar al menos un horario'),
    services: serviceSchema,
    age_group: z
      .enum(['teens', 'young_adults', 'veterans', 'mixed'])
      .nullable(),
    categories: z.array(categorySchema).nullable(),
    country: z.string().min(1, 'País requerido'),
    state: z.string().min(1, 'Estado requerido'),
    city: z.string().min(1, 'Ciudad requerida'),
    floor_type: z
      .enum(['cement', 'parquet', 'asphalt', 'synthetic'])
      .nullable(),
    is_covered: z.boolean().nullable(),
  })
  .refine(
    (data) => {
      // Si es pickup, age_group debe estar presente y categories debe ser null
      if (data.type === 'pickup') {
        return data.age_group !== null && data.categories === null;
      }
      // Si es club, categories debe estar presente y age_group debe ser null
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

export type RegisterCommunityFormData = z.infer<typeof registerCommunitySchema>;
