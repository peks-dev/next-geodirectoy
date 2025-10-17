/**
 * Convierte un File a base64
 * Compatible tanto con browser (FileReader) como con servidor (Buffer)
 */
export async function fileToBase64(file: File): Promise<string> {
  // En el servidor (Node.js)
  if (typeof window === 'undefined') {
    // Convertir File a ArrayBuffer y luego a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
  }

  // En el navegador
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Eliminar el prefijo "data:image/jpeg;base64," para obtener solo el base64
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
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
