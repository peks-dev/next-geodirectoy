import HeadingSection from '../HeadingSection';
import CategoriesClubList from '../CategoriesClubList';
import DetailsBar from '@/app/components/ui/DetailsBar';
import SectionWrapper from './SectionWrapper';

import type { AgeGroup, CommunityType, Category } from '@/comunidad/types';

interface Props {
  description: string;
  ageGroup?: AgeGroup | null;
  profile: { name: string; avatar_url: string | null };
  type: CommunityType;
  categories?: Category[] | null;
}

export default function DescriptionSection({
  description,
  ageGroup,
  type,
  categories,
  profile,
}: Props) {
  const LABELS = {
    types: {
      pickup: 'reta',
      club: 'club',
    },
    ageGroups: {
      teens: 'adolescentes',
      young_adults: 'jovenes adultos',
      veterans: 'veteranos',
      mixed: 'mixto',
    },
  };

  return (
    <SectionWrapper>
      <div className="gap-md flex h-full flex-col">
        <HeadingSection text="general" />
        <DetailsBar
          data={[
            { label: 'tipo', value: LABELS.types[type] },
            ...(ageGroup
              ? [{ label: 'edades', value: LABELS.ageGroups[ageGroup] }]
              : []),
            { label: 'autor', value: profile.name },
          ]}
        />
        <div className="overflow-auto">
          <p>{description}</p>
        </div>
      </div>
      {categories && <CategoriesClubList categories={categories} />}
    </SectionWrapper>
  );
}
