import { getAIService } from '@/lib/ai/aiFactory';
import { parseCourtAnalysisResponse } from '@/lib/ai/parsers';
import { validateCourtAnalysis } from './validators';
import { COURT_ANALYSIS_PROMPT } from './prompts';
import type { CourtImageAnalysisResult } from './types';
import { AIUnavailableError } from '@/lib/ai/aiErrors';

export async function analyzeCourtImages(
  images: File[]
): Promise<CourtImageAnalysisResult> {
  const aiService = getAIService();

  const isAvailable = await aiService.isAvailable();
  if (!isAvailable) {
    throw new AIUnavailableError(aiService.provider);
  }

  const rawResponse = await aiService.generateContent(
    COURT_ANALYSIS_PROMPT,
    images
  );

  const analysisResult = parseCourtAnalysisResponse(
    rawResponse,
    aiService.provider
  );

  const validationResult = validateCourtAnalysis(analysisResult);

  if (!validationResult.success || !validationResult.data) {
    throw new Error(validationResult.errors.join('. '));
  }

  return {
    floorType: validationResult.data.floorType,
    isCovered: validationResult.data.isCovered,
    success: true,
  };
}
