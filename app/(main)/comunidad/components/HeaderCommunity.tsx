import ImageSlider from '@/app/components/ui/Sliders/ImageSlider';
import NavigationButton from '@/app/components/ui/Buttons/NavigationButton';
import ShareButton from './ShareButton';

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
        <div className="flex items-start gap-6">
          <NavigationButton url="/" variant="primary">
            mapa
          </NavigationButton>
          <ShareButton
            name={data.name}
            url={data.url}
            description={data.description}
          />
        </div>
        <h2 className="font-heading neon-effect text-lg uppercase">
          {data.name}
        </h2>
      </header>

      <ImageSlider images={data.images} enablePagination enableAutoplay />
    </section>
  );
}
