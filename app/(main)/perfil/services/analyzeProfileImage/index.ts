import { analyzeImages } from '@/lib/services/ai/analyzers/imageAnalyzer';
import { parseJSONResponse } from '@/lib/services/ai/utils/parsers';
import { ErrorCodes } from '@/lib/services/ai/errors/codes';
import { AIServiceError } from '@/lib/services/ai/errors/custom';
import { PROFILE_IMAGE_PROMPT } from './prompts';
import { validateProfileImageAnalysis } from './validators';
import type {
  ProfileImageAnalysisRaw,
  ProfileImageAnalysisResult,
  ProfileAnalysisInput,
} from './types';

export async function analyzeProfileImage(
  input: ProfileAnalysisInput
): Promise<ProfileImageAnalysisResult> {
  try {
    // Análisis de imagen de perfil
    const imageAnalysisResult = await analyzeImages<
      ProfileImageAnalysisRaw,
      ProfileImageAnalysisResult
    >(
      {
        prompt: PROFILE_IMAGE_PROMPT,
        images: [input.image],
        minImages: 1,
        maxImages: 1,
      },
      parseJSONResponse<ProfileImageAnalysisRaw>,
      validateProfileImageAnalysis
    );

    if (!imageAnalysisResult.isValid) {
      throw new AIServiceError(
        ErrorCodes.INAPPROPRIATE_CONTENT,
        'La imagen de perfil contiene contenido inapropiado'
      );
    }

    return imageAnalysisResult;
  } catch (error) {
    // Re-lanzar errores de IA tal cual
    if (error instanceof AIServiceError) {
      throw error;
    }

    // Para otros errores, envolver en AIServiceError
    throw new AIServiceError(
      ErrorCodes.AI_SERVICE_ERROR,
      `Error en el análisis del perfil: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`
    );
  }
}
