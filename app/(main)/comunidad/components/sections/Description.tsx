import HeadingSection from '../HeadingSection';
import CategoriesClubList from '../CategoriesClubList';
import DetailsBar from '@/app/components/ui/DetailsBar';

import type {
  AgeGroup,
  CommunityType,
  Category,
} from '@/app/types/communityTypes';

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
    <section className="flex h-full w-full flex-col">
      <div className="grow">
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
        <p>{description}</p>
      </div>
      {categories && <CategoriesClubList categories={categories} />}
    </section>
  );
}
