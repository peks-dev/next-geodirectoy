import { analyzeText } from '@/lib/services/ai/analyzers/textAnalyzer';
import { analyzeImages } from '@/lib/services/ai/analyzers/imageAnalyzer';
import { parseJSONResponse } from '@/lib/services/ai/utils/parsers';
import type { FloorType } from '@/comunidad/types';
import { ErrorCodes } from '@/lib/services/ai/errors/codes';
import { AIServiceError } from '@/lib/services/ai/errors/custom';
import {
  COMMUNITY_TEXT_ANALYSIS_PROMPT,
  COURT_ANALYSIS_PROMPT,
} from './prompts';
import {
  validateCommunityTextAnalysis,
  validateCourtAnalysis,
} from './validators';
import type {
  CommunityTextAnalysisRaw,
  CommunityTextAnalysisResult,
  CourtImageAnalysisRaw,
  CourtImageAnalysisResult,
} from './types';

interface Props {
  images: File[];
  name: string;
  description: string;
  floor_type?: FloorType;
  is_covered?: boolean;
}

export async function analyzeCommunity(
  formData: Props
): Promise<CourtImageAnalysisResult> {
  // 1. Validar textos con IA
  const textAnalysisResult = await analyzeText<
    CommunityTextAnalysisRaw,
    CommunityTextAnalysisResult
  >(
    {
      prompt: COMMUNITY_TEXT_ANALYSIS_PROMPT,
      texts: {
        name: formData.name,
        description: formData.description,
      },
    },
    parseJSONResponse<CommunityTextAnalysisRaw>,
    validateCommunityTextAnalysis
  );

  if (!textAnalysisResult.isValid) {
    throw new AIServiceError(
      ErrorCodes.INAPPROPRIATE_CONTENT,
      'El texto tiene contenido inapropiado'
    );
  }

  // 2. Si no hay imágenes nuevas (solo URLs), retornar valores por defecto
  if (formData.images.length === 0) {
    return {
      floorType: formData.floor_type || 'cement',
      isCovered: formData.is_covered ?? false,
      success: true,
    };
  }

  // 3. Si hay imágenes nuevas, analizarlas
  const result = await analyzeImages<
    CourtImageAnalysisRaw,
    CourtImageAnalysisResult
  >(
    {
      prompt: COURT_ANALYSIS_PROMPT,
      images: formData.images,
      minImages: 1,
      maxImages: 4,
    },
    parseJSONResponse<CourtImageAnalysisRaw>,
    validateCourtAnalysis
  );

  if (!result.success) {
    throw new AIServiceError(
      ErrorCodes.INAPPROPRIATE_CONTENT,
      'Las imágenes no son válidas'
    );
  }

  return {
    floorType: result.floorType,
    isCovered: result.isCovered,
    success: result.success,
  };
}
