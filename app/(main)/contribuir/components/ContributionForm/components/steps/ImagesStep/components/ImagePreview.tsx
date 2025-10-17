'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react'; // Importamos useState y useEffect
import FlexBox from '@/app/components/ui/containers/FlexBox';
import CloseIcon from '@/app/components/ui/svgs/CloseIcon';
import Button from '@/app/components/ui/Button';

interface ImagePreviewProps {
  file: File | string;
  index: number;
  deleteImgFn: () => void;
}

const ImagePreview = ({ file, index, deleteImgFn }: ImagePreviewProps) => {
  // 1. Usamos un estado para la URL de la imagen.
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const imgName = file instanceof File ? file.name : `Imagen ${index + 1}`;

  // 2. Usamos useEffect para la lógica que solo debe correr en el navegador.
  useEffect(() => {
    let objectUrl: string | undefined = undefined;

    if (file instanceof File) {
      // Si es un archivo, creamos una URL de objeto (blob).
      objectUrl = URL.createObjectURL(file);
      setImgSrc(objectUrl);
    } else {
      // Si es un string (URL de Supabase), lo usamos directamente.
      setImgSrc(file);
    }

    // 3. Función de limpieza: Es CRUCIAL para evitar memory leaks.
    // Se ejecuta cuando el componente se desmonta.
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]); // Este efecto se re-ejecuta si la prop 'file' cambia.

  // 4. Mostramos un placeholder mientras la URL se determina.
  // Esto evita que Next/Image reciba un 'src' nulo o vacío.
  if (!imgSrc) {
    return (
      <li className="border-border flex h-[116px] items-center justify-center border-2 p-2.5">
        <span className="text-text-secondary text-sm">Cargando imagen...</span>
      </li>
    );
  }

  return (
    <li className="border-border relative border-2 p-2.5">
      <FlexBox align="stretch" className="gap-2">
        <div className="bg-light-tertiary flex grow items-center">
          <figure className="border-light-tertiary relative h-24 w-24 overflow-hidden border">
            <Image
              src={imgSrc}
              alt={imgName}
              fill
              className="object-cover"
              sizes="96px"
            />
          </figure>
          <span className="text-dark-primary ml-3 truncate text-sm">
            {imgName}
          </span>
        </div>

        <Button
          variant="delete"
          onClick={deleteImgFn}
          aria-label={`Eliminar ${imgName}`}
        >
          <CloseIcon />
        </Button>
      </FlexBox>
    </li>
  );
};

export default ImagePreview;
