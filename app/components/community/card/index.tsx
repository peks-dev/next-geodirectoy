import type { CommunityCard } from '@/app/types/communityTypes';
import NavigationButton from '../../ui/Buttons/NavigationButton';
import CloseIcon from '../../ui/svgs/CloseIcon';
import Button from '../../ui/Button';
interface Props {
  data: CommunityCard;
  isPopup: boolean;
}

export default function CommunityCard({ data, isPopup }: Props) {
  const handleClosePopup = () => {
    console.log('cerrar popup');
  };
  return (
    <article className="transparent-container p-md flex flex-col">
      <header className="flex justify-between">
        <h2 className="text-md">{data.name}</h2>
        {isPopup ? (
          <Button variant="icon" onClick={handleClosePopup}>
            <CloseIcon />
          </Button>
        ) : null}
      </header>
      <div>
        {/*insertar un slider de swiper-js con deslizamiento vertical */}
      </div>
      <footer className="flex justify-between">
        <ul>
          <li>
            <p>
              <span>{data.averageRating}</span>
            </p>
          </li>
          {data.ageGroup ? (
            <li>
              <p>
                <span>{data.ageGroup}</span>
              </p>
            </li>
          ) : null}
        </ul>
        <NavigationButton url={`comunidad/${data.id}`} variant="secondary">
          explorar
        </NavigationButton>
      </footer>
    </article>
  );
}
