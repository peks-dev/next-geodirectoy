import NavigationButton from '../../ui/Buttons/NavigationButton';
import DeleteCommunityBtn from '@/app/(main)/comunidad/components/DeleteCommunityBtn';
import ImageSlider from '../../ui/Sliders/ImageSlider';
import type { CommunityCard } from '@/app/types/communityTypes';
import {
  StarIcon,
  CommentsIcon,
  PeopleIcon,
  EditIcon,
  CornerIcon,
} from '../../ui/svgs/';

interface Props {
  data: CommunityCard;
  isPopup?: boolean;
}

export default function CommunityCard({ data, isPopup = true }: Props) {
  const footerData = [
    { icon: <PeopleIcon />, value: data.type },
    { icon: <StarIcon />, value: data.average_rating },
    { icon: <CommentsIcon />, value: data.total_reviews },
  ];

  return (
    <article className="p-lg text-foreground w-full">
      <div className="transparent-container p-md flex flex-col gap-5">
        <header className="bg-border-secondary py-1">
          <h2 className="text-md text-foreground neon-effect text-center uppercase">
            {data.name}
          </h2>
        </header>

        <div className="relative">
          {/*profile buttons*/}
          {isPopup === false && (
            <div className="gap-md absolute top-5 right-5 z-50 flex flex-col">
              <NavigationButton
                url={`/comunidad/contribuir/editar/${data.id}`}
                variant="icon"
                className="bg-background-interactive p-4"
              >
                <EditIcon />
              </NavigationButton>
              <DeleteCommunityBtn communityId={data.id} />
            </div>
          )}
          <ImageSlider images={data.images} enableAutoplay enablePagination />
        </div>

        <footer className="border-border-secondary flex justify-between border-t-2 pt-3">
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
      <CornerIcon
        size="medium"
        position="top-left"
        variant="static"
        className="text-foreground"
      />
      <CornerIcon
        size="medium"
        position="top-right"
        variant="static"
        className="text-foreground"
      />
      <CornerIcon
        size="medium"
        position="bottom-left"
        variant="static"
        className="text-foreground"
      />
      <CornerIcon
        size="medium"
        position="bottom-right"
        variant="static"
        className="text-foreground"
      />
    </article>
  );
}
