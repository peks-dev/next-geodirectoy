import { useRef } from 'react';
import { toast } from 'sonner';
import { useContributionStore } from '../../../store/useContributionStore';
import WrapperStep from '../WrapperStep';
import ImagePreview from './components/ImagePreview';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import Button from '@/app/components/ui/Button';

const MAX_IMAGES = 4;
const MIN_IMAGES = 2;

export default function ImagesStep() {
  const { images, addImages, removeImage } = useContributionStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkImageOrientation = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.width > img.height);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];

    for (const file of files) {
      const isHorizontal = await checkImageOrientation(file);
      if (isHorizontal) {
        validFiles.push(file);
      } else {
        toast.error(`la imagen debe ser horizontal.`);
      }
    }

    if (validFiles.length > 0) {
      addImages(validFiles);
    }

    // Limpiar el input para permitir re-seleccionar los mismos archivos si es necesario
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (index: number) => {
    removeImage(index);
  };

  const canAddMore = images.length < MAX_IMAGES;

  return (
    <WrapperStep className="flex flex-col gap-xl">
      <p className="text-center text-sm">
        Selecciona o toma {MIN_IMAGES} como mínimo, {MAX_IMAGES} máximo
        <br />
        <span className="text-foreground-accent">
          todas deben ser orizontales
        </span>
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <ul className="grow">
        {images.length > 0 && (
          <FlexBox direction="col" align="stretch" gap="md">
            {images.map((img, index) => (
              <ImagePreview
                key={`${img instanceof File ? img.name : img}-${index}`}
                file={img}
                index={index}
                deleteImgFn={() => handleRemove(index)}
              />
            ))}
          </FlexBox>
        )}
      </ul>

      {canAddMore && (
        <Button onClick={handleButtonClick}>Elegir imágenes</Button>
      )}
    </WrapperStep>
  );
}
