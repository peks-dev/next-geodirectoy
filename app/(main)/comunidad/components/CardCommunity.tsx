'use client';

import { memo } from 'react';
import { useCustomNavigation } from '@/lib/hooks/useNavigation';
import NavigationButton from '../../../components/ui/Buttons/NavigationButton';
import DeleteCommunityBtn from '@/comunidad/components/DeleteCommunityBtn';
import ImageSlider from '../../../components/ui/Sliders/ImageSlider';
import type { CommunityCard } from '@/comunidad/types';
import { usePanelLoaderStore } from '../../map/stores/usePanelStore';
import Button from '@/app/components/ui/Button';

import {
  StarIcon,
  CommentsIcon,
  PeopleIcon,
  EditIcon,
  CornerIcon,
} from '../../../components/ui/svgs/';

interface Props {
  data: CommunityCard;
  isPopup?: boolean;
}

function CardCommunity({ data, isPopup = true }: Props) {
  const footerData = [
    { icon: <PeopleIcon />, value: data.type },
    { icon: <StarIcon />, value: data.average_rating },
    { icon: <CommentsIcon />, value: data.total_reviews },
  ];
  const { setLoading } = usePanelLoaderStore();
  const { navigate } = useCustomNavigation();

  const handleNavigation = () => {
    setLoading(true);
    navigate(`/comunidad/ver/${data.id}`, { scroll: false });
  };

  return (
    <article className="p-lg text-foreground w-full">
      <div className="flex flex-col gap-5">
        <header className="bg-border-secondary py-1">
          <h2 className="text-md text-foreground neon-effect text-center uppercase">
            {data.name}
          </h2>
        </header>

        <div className="border-border-secondary relative border-2">
          {/*profile buttons*/}
          {isPopup === false && (
            <div className="bg-border-secondary gap-md absolute bottom-0 left-0 z-50 flex">
              <NavigationButton
                url={`/comunidad/contribuir/editar/${data.id}`}
                variant="icon"
                size="small"
                className="bg-border-secondary p-4"
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
          <Button variant="secondary" onClick={handleNavigation}>
            explorar
          </Button>
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

export default memo(CardCommunity, (prevProps, nextProps) => {
  // Retorna true si las props son iguales (NO re-renderizar)
  return (
    prevProps.data.id === nextProps.data.id &&
    prevProps.data.name === nextProps.data.name &&
    prevProps.data.average_rating === nextProps.data.average_rating &&
    prevProps.data.total_reviews === nextProps.data.total_reviews &&
    prevProps.data.type === nextProps.data.type &&
    prevProps.isPopup === nextProps.isPopup &&
    // Comparación superficial del array de imágenes
    prevProps.data.images.length === nextProps.data.images.length &&
    prevProps.data.images.every(
      (img, idx) => img === nextProps.data.images[idx]
    )
  );
});
