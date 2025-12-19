import DinamicSlider from '@/app/components/ui/Sliders/DinamicSlider';
import {
  TextIcon,
  ClockIcon,
  CommentsIcon,
  DetailsIcon,
  LocationIcon,
} from '@/app/components/ui/svgs/';

import type { CommunityFullResponse } from '@/comunidad/types';

// sections
import DescriptionSection from './sections/Description';
import LocationSection from './sections/Location';
import ScheduleSection from './sections/Schedule';
import ReviewsSection from '../reviews/components/ReviewsSection';
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
          profile={community.profile}
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
      component: (
        <ReviewsSection
          average_rating={community.average_rating}
          total_reviews={community.total_reviews}
          community_id={community.id}
        />
      ),
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
    <div className="transparent-container flex grow overflow-hidden">
      <DinamicSlider slides={slides} />
    </div>
  );
}
