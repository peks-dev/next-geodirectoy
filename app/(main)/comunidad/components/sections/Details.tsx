'use client';

import { useState } from 'react';
import HeadingSection from '../HeadingSection';
import CategoriesClubList from '../CategoriesClubList';
import AvailableServices from '../AvailableServices';
import type { Service, Category } from '@/comunidad/types';
import SectionWrapper from './SectionWrapper';
import ViewSwitcher from './ViewSwitcher';

interface Props {
  serviceStatus: Service;
  categories?: Category[] | null;
}

export default function DetailsSection({ serviceStatus, categories }: Props) {
  const [activeView, setActiveView] = useState<'categories' | 'services'>(
    categories ? 'categories' : 'services'
  );

  const showSwitcher = !!categories;

  return (
    <SectionWrapper>
      <HeadingSection text="disponibles">
        {showSwitcher && (
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
        )}
      </HeadingSection>
      {showSwitcher && activeView === 'categories' && (
        <CategoriesClubList categories={categories} />
      )}
      {(!showSwitcher || activeView === 'services') && (
        <AvailableServices serviceStatus={serviceStatus} />
      )}
    </SectionWrapper>
  );
}
