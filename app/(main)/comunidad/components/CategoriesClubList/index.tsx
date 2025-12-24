'use client';
import { useState } from 'react';
import { Category, Gender } from '@/comunidad/types';
import CategoryCardDisplay from './CategoryCardDisplay';
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
    <div className="flex grow flex-col">
      {/* Scroll horizontal de categorías */}
      <div className="swiper-no-swiping overflow-x-auto overflow-y-hidden px-3 pb-10">
        <ul className="flex h-full gap-5">
          {filteredCategories.map((cat, idx) => (
            <CategoryCardDisplay key={idx} category={cat} />
          ))}
        </ul>
      </div>

      <CategoriesListControllers filter={filter} setFilter={setFilter} />
    </div>
  );
}
