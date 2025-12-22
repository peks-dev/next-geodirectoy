import ImageSlider from '@/app/components/ui/Sliders/ImageSlider';
import ShareButton from './ShareButton';

interface Props {
  name: string;
  images: string[];
  description: string;
}

export default function HeaderCommunity(data: Props) {
  return (
    <section className="flex shrink-0 flex-col gap-4 lg:max-w-175">
      <header className="flex justify-between">
        <h2 className="font-heading neon-effect text-lg uppercase">
          {data.name}
        </h2>
        <div className="flex items-center gap-6">
          <ShareButton name={data.name} description={data.description} />
        </div>
      </header>

      <ImageSlider images={data.images} enablePagination enableAutoplay />
    </section>
  );
}
