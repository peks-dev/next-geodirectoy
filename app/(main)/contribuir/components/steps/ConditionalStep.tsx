import { useContributionStore } from '../../store/useContributionStore';
import ToggleInput from '@/app/components/ui/inputs/Toggle';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import type { AgeGroup } from '@/app/types/communityTypes';
import WarningIcon from '@/app/components/ui/svgs/WarningIcon';

const possibleCategories = [
  { category: 'Chupón', min_age: 6, max_age: 7 },
  { category: 'Micro', min_age: 8, max_age: 9 },
  { category: 'Infantil', min_age: 10, max_age: 11 },
  { category: 'U-13', min_age: 12, max_age: 13 },
  { category: 'U-15', min_age: 14, max_age: 15 },
  { category: 'U-17', min_age: 16, max_age: 17 },
  { category: 'U-19', min_age: 18, max_age: 19 },
  { category: 'Sub-22', min_age: 18, max_age: 21 },
  { category: 'Libre', min_age: 22, max_age: null },
];

const ageGroupOptions = [
  { value: 'teens', label: 'Adolescentes' },
  { value: 'young_adults', label: 'Jóvenes adultos' },
  { value: 'veterans', label: 'Veteranos' },
  { value: 'mixed', label: 'Mixta' },
];

const genders = ['male', 'female', 'mixed'];
const genderLabels = {
  male: 'Masculino',
  female: 'Femenino',
  mixed: 'Mixto',
};

export default function ConditionalStep() {
  const { type, categories, age_group, updateFormField } =
    useContributionStore();

  const toggleCategory = (category: string, included: boolean) => {
    if (included) {
      const cat = possibleCategories.find((c) => c.category === category);
      if (cat) {
        const newCategories = [
          ...(categories || []),
          { ...cat, genders: ['mixed'] },
        ];
        updateFormField('categories', newCategories);
      }
    } else {
      const newCategories = (categories || []).filter(
        (c) => c.category !== category
      );
      updateFormField('categories', newCategories);
    }
  };

  const setCategoryGenders = (category: string, newGenders: string[]) => {
    const newCategories = (categories || []).map((c) =>
      c.category === category ? { ...c, genders: newGenders } : c
    );
    updateFormField('categories', newCategories);
  };

  const handleGenderChange = (
    category: string,
    gender: string,
    checked: boolean
  ) => {
    const currentCat = (categories || []).find((c) => c.category === category);
    if (!currentCat) return;
    const newGenders = checked
      ? [...currentCat.genders, gender]
      : currentCat.genders.filter((g) => g !== gender);
    if (newGenders.length === 0) return; // Prevent removing all genders
    setCategoryGenders(category, newGenders);
  };

  if (type === 'club') {
    return (
      <FlexBox direction="col" className="h-full max-h-full">
        <h2 className="border-border-secondary font-oxanium grow-0 border-b-2 pb-4 text-center text-sm">
          Selecciona las categorías disponibles
        </h2>
        <div className="max-h-full w-full overflow-auto pt-10">
          <FlexBox direction="col" className="gap-md" justify="around">
            {possibleCategories.map((cat) => {
              const isSelected = (categories || []).some(
                (c) => c.category === cat.category
              );
              const selectedCat = (categories || []).find(
                (c) => c.category === cat.category
              );
              return (
                <FlexBox
                  key={cat.category}
                  className={`py-sm bg-background-interactive text-accent-primary hover:border-accent-primary cursor-pointer border-2 ${isSelected ? 'border-accent-primary' : 'border-background-interactive'}`}
                  align="center"
                  justify="between"
                  direction="col"
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    id={`cat-${cat.category}`}
                    name="categories"
                    value={cat.category}
                    checked={isSelected}
                    onChange={(e) =>
                      toggleCategory(cat.category, e.target.checked)
                    }
                  />
                  <label
                    htmlFor={`cat-${cat.category}`}
                    className={`font-heading text-md w-full text-center uppercase ${isSelected ? 'text-neon-accent' : ''}`}
                  >
                    {`${cat.category} (${cat.min_age}-${cat.max_age || 'y más'} años)`}
                  </label>
                  {isSelected && (
                    <div className="gap-sm flex flex-col">
                      <h3 className="font-oxanium text-foreground-on-interactive my-3 text-center">
                        Géneros para {cat.category}:
                      </h3>
                      <div className="flex pb-2">
                        {genders.map((gender) => (
                          <ToggleInput
                            key={gender}
                            type="checkbox"
                            id={`cat-${cat.category}-gender-${gender}`}
                            name={`cat-${cat.category}-genders`}
                            value={gender}
                            checked={
                              selectedCat?.genders.includes(gender) || false
                            }
                            onChange={(e) =>
                              handleGenderChange(
                                cat.category,
                                gender,
                                e.target.checked
                              )
                            }
                            text={
                              genderLabels[gender as keyof typeof genderLabels]
                            }
                            wrapperClass="inline-block mr-2"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </FlexBox>
              );
            })}
          </FlexBox>
        </div>
      </FlexBox>
    );
  }

  if (type === 'pickup') {
    return (
      <FlexBox className="h-full" align="center">
        <div className="m-auto">
          <h2 className="text-md font-oxanium mb-xl text-center">
            Selecciona la edad predominante
          </h2>
          <FlexBox wrap="wrap" justify="around" className="gap-md">
            {ageGroupOptions.map((option) => (
              <ToggleInput
                key={option.value}
                type="radio"
                id={`age-group-${option.value}`}
                name="age_group"
                value={option.value}
                checked={age_group === option.value}
                onChange={(e) =>
                  updateFormField('age_group', e.target.value as AgeGroup)
                }
                text={option.label}
                wrapperClass="mb-2"
              />
            ))}
          </FlexBox>
        </div>
      </FlexBox>
    );
  }

  return (
    <FlexBox direction="col" className="h-full" justify="center" align="center">
      <p className="text-md font-oxanium mb-xl text-center">
        Selecciona un tipo de comunidad.
      </p>
      <figure className="text-error neon-effect h-[15rem] w-[15rem]">
        <WarningIcon />
      </figure>
    </FlexBox>
  );
}
