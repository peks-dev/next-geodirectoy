import { ZodError } from 'zod';
import { analyzeCourtImages, analyzeTextsCommunity } from '../../../analysis';
import { communityFormSchema } from '../../../schemas/contributionSchema';
import type { CommunityFormData } from '@/app/types/communityTypes';
import type { CourtImageAnalysisResult } from '../../../analysis/types';

export async function validateFormData(
  formData: CommunityFormData
): Promise<CourtImageAnalysisResult> {
  try {
    // 1. Validar con Zod
    communityFormSchema.parse(formData);

    // 2. Validar textos con IA
    const textAnalysisResult = await analyzeTextsCommunity({
      name: formData.name,
      description: formData.description,
    });

    if (!textAnalysisResult.isValid) {
      throw new Error(
        'El nombre o descripción de la comunidad parece contener spam o contenido inapropiado.'
      );
    }

    // 3. Validar imágenes solo si hay Files nuevos
    const newImageFiles = formData.images.filter(
      (image): image is File => image instanceof File
    );

    // Si no hay imágenes nuevas (solo URLs), retornar valores por defecto
    if (newImageFiles.length === 0) {
      return {
        floorType: formData.floor_type || 'cement', // Mantener tipo existente
        isCovered: formData.is_covered,
        success: true,
      };
    }

    // Si hay imágenes nuevas, analizarlas
    const result = await analyzeCourtImages(newImageFiles);

    return {
      floorType: result.floorType,
      isCovered: result.isCovered,
      success: result.success,
    };
  } catch (error) {
    // Re-lanzar como error personalizado para evitar stack traces innecesarios
    if (error instanceof ZodError) {
      throw error; // Mantener ZodError para el manejo correcto
    }
    throw new Error(
      error instanceof Error ? error.message : 'Error de validación'
    );
  }
}
