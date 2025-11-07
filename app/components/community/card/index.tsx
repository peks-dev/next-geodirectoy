import NavigationButton from '../../ui/Buttons/NavigationButton';
import ImageSlider from '../../ui/Sliders/ImageSlider';
import type { CommunityCard } from '@/app/types/communityTypes';
import { StarIcon, CommentsIcon, PeopleIcon } from '../../ui/svgs/';

interface Props {
  data: CommunityCard;
  isPopup?: boolean;
}

export default function CommunityCard({ data, isPopup = false }: Props) {
  const footerData = [
    { icon: <PeopleIcon />, value: data.type },
    { icon: <StarIcon />, value: data.average_rating },
    { icon: <CommentsIcon />, value: data.total_reviews },
  ];

  return (
    <article className="gap-md flex w-full flex-col">
      <header className="bg-dark-primary p-sm border-accent-primary flex justify-between border-x-2">
        <h2 className="text-md text-light-secondary neon-effect uppercase">
          {data.name}
        </h2>
      </header>
      <div className="transparent-container p-md">
        <ImageSlider images={data.images} enableAutoplay enablePagination />
        <footer className="border-border-secondary mt-5 flex justify-between border-t-2 pt-3">
          <ul className="flex grow items-center gap-6">
            {footerData.map((e, i) => (
              <li key={i} className="flex items-center gap-3">
                <figure className="h-(--icon-small-size) w-(--icon-small-size)">
                  {e.icon}
                </figure>
                <p className="neon-effect font-heading text-sm uppercase">
                  {e.value}
                </p>
              </li>
            ))}
          </ul>
          <NavigationButton url={`comunidad/${data.id}`} variant="secondary">
            explorar
          </NavigationButton>
        </footer>
      </div>
    </article>
  );
}
