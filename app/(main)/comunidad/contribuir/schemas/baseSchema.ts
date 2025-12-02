import * as z from 'zod';

// Schema para coordenadas
export const coordinatesSchema = z
  .object({
    lat: z.number().min(-90).max(90, 'Latitud debe estar entre -90 y 90'),
    lng: z.number().min(-180).max(180, 'Longitud debe estar entre -180 y 180'),
  })
  .refine((data) => data !== null, { message: 'marca una ubicacion' });

// Schema para servicios
export const serviceSchema = z.object({
  transport: z.boolean(),
  store: z.boolean(),
  wifi: z.boolean(),
  bathroom: z.boolean(),
});

// Schema para horario
export const scheduleSchema = z
  .object({
    days: z.array(z.string()).min(1, 'Debe seleccionar al menos un día'),
    time: z.object({
      start: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido'),
      end: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido'),
    }),
  })
  .refine((data) => data.time.start < data.time.end, {
    message: 'La hora de inicio debe ser anterior a la hora de fin',
    path: ['time'],
  });

// Schema para categoría (solo para clubs)
export const categorySchema = z.object({
  category: z.string().min(1, 'Categoría es requerida'),
  min_age: z.number().min(0, 'Edad mínima debe ser mayor a 0'),
  max_age: z.number().nullable(),
  genders: z
    .array(z.enum(['male', 'female', 'mixed']))
    .min(1, 'Debe seleccionar al menos un género'),
});

// Schema flexible para imágenes (File o string) - EXPORTADO para updateCommunitySchema
export const imageSchema = z.union([
  z.instanceof(File),
  z.string().url('URL de imagen inválida'),
]);
