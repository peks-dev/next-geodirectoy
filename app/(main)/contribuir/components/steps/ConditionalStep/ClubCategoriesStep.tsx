import FlexBox from '@/app/components/ui/containers/FlexBox';
import { POSSIBLE_CATEGORIES } from './constants';
import { useCategoriesLogic } from './useCategoriesLogic';
import CategoryCard from './CategoryCard';

export default function ClubCategoriesStep() {
  const { categories, toggleCategory, handleGenderChange } =
    useCategoriesLogic();

  return (
    <FlexBox direction="col" className="h-full max-h-full">
      <h2 className="border-border-secondary font-oxanium grow-0 border-b-2 pb-4 text-center text-sm">
        Selecciona las categorías disponibles
      </h2>
      <div className="max-h-full w-full overflow-auto pt-10">
        <FlexBox direction="col" className="gap-md" justify="around">
          {POSSIBLE_CATEGORIES.map((cat) => {
            const isSelected = (categories || []).some(
              (c) => c.category === cat.category
            );
            const selectedCat = (categories || []).find(
              (c) => c.category === cat.category
            );

            return (
              <CategoryCard
                key={cat.category}
                category={cat}
                isSelected={isSelected}
                selectedCat={selectedCat}
                onToggle={toggleCategory}
                onGenderChange={handleGenderChange}
              />
            );
          })}
        </FlexBox>
      </div>
    </FlexBox>
  );
}
