import HeadingSection from '../HeadingSection';
import CategoriesClubList from '../CategoriesClubList';
import AvailableServices from '../AvailableServices';
import type { Service, Category } from '@/app/types/communityTypes';
import SectionWrapper from './SectionWrapper';

interface Props {
  serviceStatus: Service;
  categories?: Category[] | null;
}

export default function DetailsSection({ serviceStatus, categories }: Props) {
  return (
    <SectionWrapper>
      <HeadingSection text="disponibles" />
      {categories && <CategoriesClubList categories={categories} />}
      <AvailableServices serviceStatus={serviceStatus} />
    </SectionWrapper>
  );
}
