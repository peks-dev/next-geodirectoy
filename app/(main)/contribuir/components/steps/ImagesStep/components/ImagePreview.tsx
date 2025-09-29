import Image from 'next/image';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import CloseIcon from '@/app/components/ui/svgs/CloseIcon';
import Button from '@/app/components/ui/Button';
interface ImagePreviewProps {
  file: File | string;
  index: number;
  deleteImgFn: () => void;
}

const ImagePreview = ({ file, index, deleteImgFn }: ImagePreviewProps) => {
  let imgSrc = '';
  let imgName = '';

  if (file instanceof File) {
    imgSrc = URL.createObjectURL(file);
    imgName = file.name;
  } else {
    imgSrc = file as string; // Asumimos que es una URL
    imgName = `Imagen ${index + 1}`; // Alternativa para el alt
  }

  return (
    <li className="relative p-2.5 border-2 border-border">
      <FlexBox align="stretch" className="gap-2">
        <div className="bg-light-tertiary flex grow items-center">
          <figure className="w-24 h-24 border border-light-tertiary overflow-hidden relative">
            <Image
              src={imgSrc}
              alt={imgName}
              fill
              className="object-cover"
              sizes="96px"
            />
          </figure>
          <span className="text-sm text-dark-primary ml-3">{imgName}</span>
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
