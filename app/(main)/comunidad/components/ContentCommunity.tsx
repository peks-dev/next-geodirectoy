import DinamicSlider from '@/app/components/ui/Sliders/DinamicSlider';
import TextIcon from '@/app/components/ui/svgs/TextIcon';
import ClockIcon from '@/app/components/ui/svgs/ClockIcon';
import TargetIcon from '@/app/components/ui/svgs/LocationIcon';
import CommentsIcon from '@/app/components/ui/svgs/CommentsIcon';
import DetailsIcon from '@/app/components/ui/svgs/DetailsIcon';
import type { CommunityFullResponse } from '@/app/types/communityTypes';

// sections
import DescriptionSection from './sections/Description';
import LocationSection from './sections/Location';
import ScheduleSection from './sections/Schedule';
import CommentsSection from './sections/Comments';
import DetailsSection from './sections/Details';

export default function ContentCommunity({
  community,
}: {
  community: CommunityFullResponse;
}) {
  const slides = [
    {
      id: 'description',
      component: (
        <DescriptionSection
          description={community.description}
          ageGroup={community.age_group}
          type={community.type}
        />
      ),
      icon: <TextIcon />,
      label: 'descripción',
    },
    {
      id: 'location',
      component: (
        <LocationSection
          location={{ lat: community.lat, lng: community.lng }}
        />
      ),
      icon: <TargetIcon />,
      label: 'ubicación',
    },
    {
      id: 'schedules',
      component: <ScheduleSection schedules={community.schedule} />,
      icon: <ClockIcon />,
      label: 'horarios',
    },
    {
      id: 'comments',
      component: <CommentsSection />,
      icon: <CommentsIcon />,
      label: 'comentarios',
    },
    {
      id: 'details',
      component: (
        <DetailsSection
          serviceStatus={community.services}
          categories={community.categories}
        />
      ),
      icon: <DetailsIcon />,
      label: 'detalles',
    },
  ];
  return (
    <div className="transparent-container flex flex-grow overflow-hidden">
      <DinamicSlider slides={slides} />
    </div>
  );
}
