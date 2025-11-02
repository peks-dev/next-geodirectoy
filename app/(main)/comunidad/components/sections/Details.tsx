import HeadingSection from '../HeadingSection';
import CategoriesClubList from '../CategoriesClubList';
import AvailableServices from '../AvailableServices';
import type { Service, Category } from '@/app/types/communityTypes';

interface Props {
  serviceStatus: Service;
  categories?: Category[] | null;
}

export default function DetailsSection({ serviceStatus, categories }: Props) {
  return (
    <div className="flex h-full w-full flex-col">
      <HeadingSection text="disponibles" />
      {categories && <CategoriesClubList categories={categories} />}
      <AvailableServices serviceStatus={serviceStatus} />
    </div>
  );
}
