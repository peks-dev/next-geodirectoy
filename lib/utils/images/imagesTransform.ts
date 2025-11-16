/**
 * Convierte un File a base64
 * Compatible tanto con browser (FileReader) como con servidor (Buffer)
 */
export async function fileToBase64(file: File): Promise<string> {
  // En el servidor (Node.js)
  if (typeof window === 'undefined') {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Agregar el prefijo data URL
    return `data:${file.type};base64,${buffer.toString('base64')}`;
  }

  // En el navegador
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Mantener el resultado completo con el prefijo
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convierte múltiples Files a base64
 * Compatible tanto con browser como con servidor
 */
export async function filesToBase64(files: File[]): Promise<string[]> {
  return Promise.all(files.map((file) => fileToBase64(file)));
}

/**
 * Función específica para el servidor usando Buffer
 * Más eficiente cuando sabes que estás en Node.js
 */
export async function fileToBase64Server(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}

/**
 * Convierte base64 string a Buffer para subirlo a Supabase Storage
 */
export function base64ToBuffer(base64: string): Buffer {
  // Extraer solo la parte base64 (sin el prefijo "data:image/...;base64,")
  const base64Data = base64.split(',')[1];
  return Buffer.from(base64Data, 'base64');
}
