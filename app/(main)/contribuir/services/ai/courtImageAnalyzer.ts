import { analyzeImages } from '@/lib/services/ai/analyzers/imageAnalyzer';
import { parseJSONResponse } from '@/lib/services/ai/utils/parsers';
import { COURT_ANALYSIS_PROMPT } from './prompts';
import { validateCourtAnalysis } from './validators';
import type { CourtImageAnalysisRaw, CourtImageAnalysisResult } from '../types';

/**
 * Función pública para analizar imágenes de canchas
 * Esta es la única que se exporta del dominio
 */
export async function analyzeCourtImages(
  images: File[]
): Promise<CourtImageAnalysisResult> {
  return analyzeImages<CourtImageAnalysisRaw, CourtImageAnalysisResult>(
    {
      prompt: COURT_ANALYSIS_PROMPT,
      images,
      minImages: 1,
      maxImages: 4,
    },
    parseJSONResponse<CourtImageAnalysisRaw>,
    validateCourtAnalysis
  );
}
