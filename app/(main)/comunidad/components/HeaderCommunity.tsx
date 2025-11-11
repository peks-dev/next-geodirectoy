import ImageSlider from '@/app/components/ui/Sliders/ImageSlider';
import ShareButton from './ShareButton';
import OpenMenuBtn from '@/app/components/Menu/OpenMenuBtn';

interface Props {
  name: string;
  images: string[];
  url: string;
  description: string;
}

export default function HeaderCommunity(data: Props) {
  return (
    <section className="flex flex-shrink-0 flex-col gap-4 lg:max-w-[700px]">
      <header className="flex justify-between">
        <h2 className="font-heading neon-effect text-lg uppercase">
          {data.name}
        </h2>
        <div className="flex items-center gap-6">
          <ShareButton
            name={data.name}
            url={data.url}
            description={data.description}
          />
          <OpenMenuBtn variant="primary" />
        </div>
      </header>

      <ImageSlider images={data.images} enablePagination enableAutoplay />
    </section>
  );
}
