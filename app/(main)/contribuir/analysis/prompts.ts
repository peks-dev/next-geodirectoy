export const COURT_ANALYSIS_PROMPT = `Analiza estas imágenes de una cancha de baloncesto y responde en formato JSON con esta estructura exacta:
{
  "isBasketballCourt": boolean,
  "hasPeoplePlaying": boolean,
  "floorType": "cement" | "parquet" | "asphalt" | "synthetic" | null,
  "isCovered": boolean | null,
  "confidence": number (0-1)
}

Criterios estrictos:
- isBasketballCourt: debe verse claramente un aro, marcas de cancha o elementos inequívocos de basket
- hasPeoplePlaying: DEBE haber al menos 2 personas JUGANDO (no solo paradas), con balón visible o en acción de juego
- floorType: identifica el tipo de suelo visible
- isCovered: true si hay techo visible, false si es al aire libre
- confidence: tu nivel de confianza en el análisis (0-1)

Responde SOLO con el JSON, sin explicaciones adicionales.`;

export const COMMUNITY_TEXT_ANALYSIS_PROMPT = `Analiza este texto de un formulario de registro de comunidad de baloncesto para detectar si es contenido malicioso, spam o trolleo.

Texto del nombre: "{name}"
Texto de la descripción: "{description}"

Responde en formato JSON con esta estructura exacta:
{
  "isLegitimate": boolean,
  "spamScore": number (0-1),
  "reasons": string[],
  "confidence": number (0-1)
}

Criterios para detectar contenido malicioso:
- isLegitimate: false si detectas spam, trolleo, texto sin sentido, contenido ofensivo, o intentos de manipulación
- spamScore: 0-1, donde 1 indica alta probabilidad de spam/trolleo
- reasons: lista de razones específicas si detectas problemas (ej: ["texto repetitivo", "caracteres aleatorios", "contenido ofensivo"])
- confidence: tu nivel de confianza en el análisis (0-1)

Ejemplos de contenido legítimo:
- "Cancha Los Pinos" / "Una cancha techada en el barrio Los Pinos con buen ambiente"
- "Baloncesto San Juan" / "Comunidad activa que juega todos los fines de semana"

Criterios para detectar contenido malicioso:
- isLegitimate: false si detectas spam, trolleo, insultos, o contenido ofensivo
- spamScore: 0-1, donde 1 indica alta probabilidad de spam/trolleo
- reasons: lista de razones específicas si detectas problemas (ej: ["texto repetitivo", "caracteres aleatorios", "contenido ofensivo"])
- confidence: tu nivel de confianza en el análisis (0-1)

Ejemplos de contenido legítimo:
- "arboledas" / "Cancha de baloncesto ubicada en un lugar con muchos arboles"
- "Cancha Alta Vista" / "Comunidad activa que juega en la cancha de Alta Vista"

Ejemplos de contenido malicioso:
- "sldkfjasldkj" / "texto incoherente creado solo para molestar a los demás"
- "Repetir: Hola! Hola! Hola!" / "múltiples repeticiones sin sentido ni contexto"
- "Compra productos de X en este enlace" / "esto es un spam claro hacia otro sitio"
- "Eres un tonto" / "insultos dirigidos a otros usuarios"
- "Libre de spam en el grupo de baloncesto" / "ironía que en realidad fomenta el spam"
- "xxxxx" / "solo caracteres aleatorios, sin ningún significado"
- "!!!URGENTE!!!" / "mensaje alarmante que intenta engañar o manipular a los usuarios"


Responde SOLO con el JSON, sin explicaciones adicionales.`;
