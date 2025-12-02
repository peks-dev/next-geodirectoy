import { Category, Gender } from '@/comunidad/types';
import ItemContainer from '@/components/ui/containers/ItemList';

// Objeto para centralizar los detalles de cada género
const GENDER_DETAILS: Record<
  Gender,
  {
    icon: string;
    label: string;
    baseClass: string;
    iconClass: string;
    textClass: string;
  }
> = {
  male: {
    icon: '♂',
    label: 'Masc.',
    baseClass: 'bg-background',
    iconClass: 'text-blue-400',
    textClass: 'text-blue-500',
  },
  female: {
    icon: '♀',
    label: 'Fem.',
    baseClass: 'bg-background',
    iconClass: 'text-pink-400',
    textClass: 'text-pink-500',
  },
  mixed: {
    icon: '⚥',
    label: 'Mixto',
    baseClass: 'bg-background',
    iconClass: 'text-purple-400',
    textClass: 'text-purple-500',
  },
};

interface CategoryCardInfoProps {
  category: Category;
}

// Función auxiliar para el rango de edad
const getAgeRange = (min: number, max: number | null) => {
  if (max === null) return `${min}+`;
  return `${min}-${max}`;
};

export default function CategoryCardDisplay({
  category,
}: CategoryCardInfoProps) {
  return (
    <ItemContainer className="h-full max-h-[250px] max-w-[160px] min-w-[130px]">
      <div className="mb-1.5 text-center">
        <h4 className="text-md font-bold uppercase">{category.category}</h4>
        <span className="text-xs font-bold">
          {getAgeRange(category.min_age, category.max_age)} años
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2">
        {category.genders?.map((gender) => {
          const details = GENDER_DETAILS[gender];
          if (!details) return null; // Por si acaso viene un género no esperado
          return (
            <div
              key={gender}
              className={`flex items-center justify-center gap-2 rounded px-1.5 py-0.5 ${details.baseClass}`}
            >
              <span className={`text-3xl ${details.iconClass}`}>
                {details.icon}
              </span>
              <span className={`p-1 text-xs font-bold ${details.textClass}`}>
                {details.label}
              </span>
            </div>
          );
        })}
      </div>
    </ItemContainer>
  );
}
