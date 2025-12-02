import HeadingSection from '../HeadingSection';
import CategoriesClubList from '../CategoriesClubList';
import DetailsBar from '@/app/components/ui/DetailsBar';
import SectionWrapper from './SectionWrapper';

import type { AgeGroup, CommunityType, Category } from '@/comunidad/types';

interface Props {
  description: string;
  ageGroup?: AgeGroup | null;
  userId?: string;
  type: CommunityType;
  categories?: Category[] | null;
}

export default function DescriptionSection({
  description,
  ageGroup,
  type,
  categories,
}: Props) {
  const LABELS = {
    types: {
      pickup: 'reta',
      club: 'club',
    },
    ageGroups: {
      teens: 'adolecentes',
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
            { label: 'autor', value: 'peks' },
          ]}
        />
        <div className="overflow auto">
          <p>{description}</p>
        </div>
      </div>
      {categories && <CategoriesClubList categories={categories} />}
    </SectionWrapper>
  );
}
