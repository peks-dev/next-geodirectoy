import HeadingSection from '../HeadingSection';
import CategoriesClubList from '../CategoriesClubList';
import UserBadge from '@/components/profile/UserBadge';
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
        <div className="gap-md bg-background border-border mb-md flex justify-around rounded-md p-2">
          <p className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-heading text-center text-2xl uppercase">
              tipo:
            </span>
            <span className="font-heading neon-effect text-4xl uppercase">
              {LABELS.types[type]}
            </span>
          </p>
          {ageGroup && (
            <p className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-heading text-center text-2xl uppercase">
                edades:
              </span>
              <span className="font-heading neon-effect text-4xl uppercase">
                {LABELS.ageGroups[ageGroup]}
              </span>
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-heading text-center text-2xl uppercase">
              autor:
            </span>
            <UserBadge name="peks" />
          </div>
        </div>
        <p>{description}</p>
      </div>
      {categories && <CategoriesClubList categories={categories} />}
    </section>
  );
}
