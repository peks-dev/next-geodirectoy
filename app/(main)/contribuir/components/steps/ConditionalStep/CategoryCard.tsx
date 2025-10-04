import FlexBox from '@/app/components/ui/containers/FlexBox';
import ToggleInput from '@/app/components/ui/inputs/Toggle';
import { GENDERS, GENDER_LABELS } from './constants';
import type { Category, Gender } from '@/app/types/communityTypes';

interface CategoryCardProps {
  category: Omit<Category, 'genders'>;
  isSelected: boolean;
  selectedCat?: Category;
  onToggle: (category: string, included: boolean) => void;
  onGenderChange: (category: string, gender: Gender, checked: boolean) => void;
}

export default function CategoryCard({
  category,
  isSelected,
  selectedCat,
  onToggle,
  onGenderChange,
}: CategoryCardProps) {
  return (
    <FlexBox
      className={`py-sm bg-background-interactive text-accent-primary hover:border-accent-primary cursor-pointer border-2 ${
        isSelected ? 'border-accent-primary' : 'border-background-interactive'
      }`}
      align="center"
      justify="between"
      direction="col"
    >
      <input
        type="checkbox"
        className="hidden"
        id={`cat-${category.category}`}
        name="categories"
        value={category.category}
        checked={isSelected}
        onChange={(e) => onToggle(category.category, e.target.checked)}
      />
      <label
        htmlFor={`cat-${category.category}`}
        className={`font-heading text-md w-full text-center uppercase ${
          isSelected ? 'text-neon-accent' : ''
        }`}
      >
        {`${category.category} (${category.min_age}-${
          category.max_age || 'y más'
        } años)`}
      </label>

      {isSelected && (
        <div className="gap-sm flex flex-col">
          <h3 className="font-oxanium text-foreground-on-interactive my-3 text-center">
            Géneros para {category.category}:
          </h3>
          <div className="flex pb-2">
            {GENDERS.map((gender) => (
              <ToggleInput
                key={gender}
                type="checkbox"
                id={`cat-${category.category}-gender-${gender}`}
                name={`cat-${category.category}-genders`}
                value={gender}
                checked={selectedCat?.genders.includes(gender) || false}
                onChange={(e) =>
                  onGenderChange(category.category, gender, e.target.checked)
                }
                text={GENDER_LABELS[gender]}
                wrapperClass="inline-block mr-2"
              />
            ))}
          </div>
        </div>
      )}
    </FlexBox>
  );
}
