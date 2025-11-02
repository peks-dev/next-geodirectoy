import DinamicSlider from '@/app/components/ui/Sliders/DinamicSlider';
import {
  TextIcon,
  ClockIcon,
  CommentsIcon,
  DetailsIcon,
  LocationIcon,
} from '@/app/components/ui/svgs/';

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
      icon: <LocationIcon />,
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
