import { useContributionStore } from '@/contribuir/stores/useContributionStore';
import { POSSIBLE_CATEGORIES } from './constants';
import type { Gender } from '@/app/types/communityTypes';

export const useCategoriesLogic = () => {
  const { categories, updateFormField } = useContributionStore();

  const toggleCategory = (category: string, included: boolean) => {
    if (included) {
      const cat = POSSIBLE_CATEGORIES.find((c) => c.category === category);
      if (cat) {
        const newCategories = [
          ...(categories || []),
          { ...cat, genders: ['mixed'] as Gender[] },
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

  const setCategoryGenders = (category: string, newGenders: Gender[]) => {
    const newCategories = (categories || []).map((c) =>
      c.category === category ? { ...c, genders: newGenders } : c
    );
    updateFormField('categories', newCategories);
  };

  const handleGenderChange = (
    category: string,
    gender: Gender,
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

  return {
    categories,
    toggleCategory,
    handleGenderChange,
  };
};
