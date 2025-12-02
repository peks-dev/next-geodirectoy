import { Gender } from '@/comunidad/types'; // Added imports for types used in props

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
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-center text-sm uppercase">categorías:</h3>
      {/* Botones de filtro */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`cursor-pointer px-2 py-0.5 text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-accent-primary text-dark-primary neon-shadow'
              : 'text-accent-primary bg-background-interactive'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('male')}
          className={`px-2 py-0.5 text-xs font-medium transition-all ${
            filter === 'male'
              ? 'bg-blue-500 text-white'
              : 'text-accent-primary bg-background-interactive'
          }`}
        >
          ♂
        </button>
        <button
          onClick={() => setFilter('female')}
          className={`px-2 py-0.5 text-xs font-medium transition-all ${
            filter === 'female'
              ? 'bg-pink-500 text-white'
              : 'text-accent-primary bg-background-interactive'
          }`}
        >
          ♀
        </button>
        <button
          onClick={() => setFilter('mixed')}
          className={`px-2 py-0.5 text-xs font-medium transition-all ${
            filter === 'mixed'
              ? 'bg-purple-500 text-white'
              : 'text-accent-primary bg-background-interactive'
          }`}
        >
          ⚥
        </button>
      </div>
    </div>
  );
}
