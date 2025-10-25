import type { CommunityCard } from '@/app/types/communityTypes';
import NavigationButton from '../../ui/Buttons/NavigationButton';
import CloseIcon from '../../ui/svgs/CloseIcon';
import Button from '../../ui/Button';
import StarIcon from '../../ui/svgs/Star';
interface Props {
  data: CommunityCard;
  isPopup?: boolean;
}

export default function CommunityCard({ data, isPopup = false }: Props) {
  const handleClosePopup = () => {
    console.log('cerrar popup');
  };
  return (
    <article className="gap-md flex w-[500px] flex-col">
      <header className="bg-dark-primary p-sm flex justify-between">
        <h2 className="text-md text-light-secondary neon-effect uppercase">
          {data.name}
        </h2>
        {isPopup ? (
          <Button variant="icon" onClick={handleClosePopup}>
            <CloseIcon />
          </Button>
        ) : null}
      </header>
      <div className="transparent-container p-md">
        <div>
          {/*insertar un slider de swiper-js con deslizamiento vertical */}
        </div>
        <footer className="border-border-secondary flex justify-between border-t-2 pt-5">
          <ul className="flex grow items-center gap-12">
            <li className="flex items-center gap-3">
              <figure className="text-light-4 h-[30px] w-[30px]">
                <StarIcon />
              </figure>
              <p className="neon-effect font-heading text-sm">
                {data.averageRating}
              </p>
            </li>
            {data.ageGroup ? (
              <li>
                <p className="m-0">
                  <span className="font-oxanium mr-4 text-xs capitalize">
                    edad:
                  </span>
                  <span className="font-heading neon-effect text-4xl uppercase">
                    {data.ageGroup}
                  </span>
                </p>
              </li>
            ) : null}
          </ul>
          <NavigationButton url={`comunidad/${data.id}`} variant="secondary">
            explorar
          </NavigationButton>
        </footer>
      </div>
    </article>
  );
}
