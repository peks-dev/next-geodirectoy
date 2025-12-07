export const PROFILE_IMAGE_PROMPT = `
Analiza esta imagen de avatar de perfil y responde en JSON con:
{
  "isAppropriate": boolean,    // No contiene contenido NSFW, pornográfico, gore, violencia extrema, o inapropiado
  "confidence": number         // Confianza del análisis (0-100)
}
`;
