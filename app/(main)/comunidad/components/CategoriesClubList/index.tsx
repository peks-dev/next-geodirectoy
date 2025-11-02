'use client';
import { useState } from 'react';
import { Category, Gender } from '@/app/types/communityTypes';
import CategoryCardInfo from '@/app/(main)/comunidad/components/CategoriesClubList/CategoryCardInfo';
import CategoriesListControllers from './CategoriesListControllers';

interface CategoriesInfoProps {
  categories: Category[];
}

export default function CategoriesClubList({
  categories,
}: CategoriesInfoProps) {
  const [filter, setFilter] = useState<Gender | 'all'>('all');

  const filteredCategories =
    filter === 'all'
      ? categories
      : categories.filter((cat) => cat.genders?.includes(filter));

  return (
    <div className="swiper-no-swiping flex flex-shrink-0 flex-col">
      <CategoriesListControllers filter={filter} setFilter={setFilter} />
      {/* Scroll horizontal de categorías */}
      <div className="-mx-3 flex-1 overflow-x-auto overflow-y-hidden px-3">
        <div className="flex h-full gap-5 pb-2">
          {filteredCategories.map((cat, idx) => (
            <CategoryCardInfo key={idx} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}
