import type { Category, AgeGroup, Gender } from '@/app/types/communityTypes';

// Tipo específico para las opciones del formulario
export interface AgeGroupOption {
  value: AgeGroup;
  label: string;
}

export const POSSIBLE_CATEGORIES: Omit<Category, 'genders'>[] = [
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

export const AGE_GROUP_OPTIONS: AgeGroupOption[] = [
  { value: 'teens', label: 'Adolescentes' },
  { value: 'young_adults', label: 'Jóvenes adultos' },
  { value: 'veterans', label: 'Veteranos' },
  { value: 'mixed', label: 'Mixta' },
];

export const GENDERS: Gender[] = ['male', 'female', 'mixed'];

export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Masculino',
  female: 'Femenino',
  mixed: 'Mixto',
};
