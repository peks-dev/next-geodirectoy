import ImageSlider from '@/app/components/ui/Sliders/ImageSlider';
import ShareButton from './ShareButton';

interface Props {
  name: string;
  images: string[];
  description: string;
}

export default function HeaderCommunity(data: Props) {
  return (
    <section className="flex shrink-0 flex-col gap-4 lg:max-w-[700px]">
      <header className="flex justify-between">
        <h2 className="font-heading neon-effect text-lg uppercase">
          {data.name}
        </h2>
      </header>
      <div className="border-foreground neon-effect text-foreground relative border-2 border-solid">
        <div className="absolute top-3 left-3 z-30">
          <ShareButton name={data.name} description={data.description} />
        </div>
        <ImageSlider images={data.images} enablePagination enableAutoplay />
      </div>
    </section>
  );
}
