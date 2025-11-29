import { analyzeText } from '@/lib/services/ai/analyzers/textAnalyzer';
import { parseJSONResponse } from '@/lib/services/ai/utils/parsers';
import { COMMUNITY_TEXT_ANALYSIS_PROMPT } from './prompts';
import { validateCommunityTextAnalysis } from './validators';
import type {
  CommunityTextAnalysisRaw,
  CommunityTextAnalysisResult,
  CommunityTexts,
} from '../types';

/**
 * Textos a analizar
 */

/**
 * Función pública para analizar textos de comunidades
 */
export async function analyzeCommunityTexts(
  texts: CommunityTexts
): Promise<CommunityTextAnalysisResult> {
  return analyzeText<CommunityTextAnalysisRaw, CommunityTextAnalysisResult>(
    {
      prompt: COMMUNITY_TEXT_ANALYSIS_PROMPT,
      texts,
    },
    parseJSONResponse<CommunityTextAnalysisRaw>,
    validateCommunityTextAnalysis
  );
}
