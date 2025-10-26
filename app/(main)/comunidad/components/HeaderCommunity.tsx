import ImageSlider from '@/app/components/ui/Sliders/ImageSlider';
import NavigationButton from '@/app/components/ui/Buttons/NavigationButton';
import type { CommunityType } from '@/app/types/communityTypes';

interface Props {
  name: string;
  images: string[];
  url: string;
  type: CommunityType;
}

export default function HeaderCommunity(data: Props) {
  return (
    <section className="flex grow-0 flex-col gap-4 sm:w-full lg:max-w-[700px]">
      <header className="flex justify-between">
        <div className="flex items-start">
          <NavigationButton url="/" variant="primary">
            mapa
          </NavigationButton>
        </div>
        <h2 className="flex flex-col items-end gap-2.5">
          <span className="font-oxanium text-2xl">{data.type}</span>
          <span className="font-heading neon-effect text-md uppercase">
            {data.name}
          </span>
        </h2>
      </header>
      <ImageSlider
        images={data.images}
        enablePagination
        enableAutoplay
        enableNavigation
      />
    </section>
  );
}
