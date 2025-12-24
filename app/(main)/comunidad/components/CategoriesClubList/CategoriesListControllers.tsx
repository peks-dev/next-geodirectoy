import { Gender } from '@/comunidad/types'; // Added imports for types used in props
import { FemaleIcon, MaleIcon, GenderIcon } from '@/app/components/ui/svgs';
import IconBox from '@/app/components/ui/IconBox';

interface CategoriesListControllersProps {
  filter: Gender | 'all';
  setFilter: (value: Gender | 'all') => void;
}

// Updated the component to accept props via destructuring
export default function CategoriesListControllers({
  filter,
  setFilter,
}: CategoriesListControllersProps) {
  return (
    <div className="flex grow items-center justify-center">
      {/* Botones de filtro */}
      <div className="flex gap-5">
        <button
          onClick={() => setFilter('all')}
          className={`cursor-pointer px-2 py-1 text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-accent-primary text-dark-primary neon-shadow'
              : 'text-accent-primary bg-background-interactive'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('male')}
          className={`cursor-pointer px-2 py-1 text-sm font-medium transition-all ${
            filter === 'male'
              ? 'bg-blue-500 text-white'
              : 'text-accent-primary bg-background-interactive'
          }`}
        >
          <IconBox icon={<MaleIcon />} size="small" />
        </button>
        <button
          onClick={() => setFilter('female')}
          className={`cursor-pointer px-2 py-1 text-sm font-medium transition-all ${
            filter === 'female'
              ? 'bg-pink-500 text-white'
              : 'text-accent-primary bg-background-interactive'
          }`}
        >
          <IconBox icon={<FemaleIcon />} size="small" />
        </button>
        <button
          onClick={() => setFilter('mixed')}
          className={`cursor-pointer px-2 py-1 text-sm font-medium transition-all ${
            filter === 'mixed'
              ? 'bg-purple-500 text-white'
              : 'text-accent-primary bg-background-interactive'
          }`}
        >
          <IconBox icon={<GenderIcon />} size="small" />
        </button>
      </div>
    </div>
  );
}
