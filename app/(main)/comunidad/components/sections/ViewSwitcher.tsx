interface Props {
  activeView: 'categories' | 'services';
  onViewChange: (view: 'categories' | 'services') => void;
}

export default function ViewSwitcher({ activeView, onViewChange }: Props) {
  return (
    <div className="bg-background-interactive flex items-center self-center p-1">
      <button
        onClick={() => onViewChange('categories')}
        className={`text-2xs px-3 py-1 font-bold transition-all duration-200 ease-in-out ${
          activeView === 'categories'
            ? 'text-dark-primary bg-accent-primary'
            : 'text-accent-primary hover-neon-text'
        }`}
      >
        Categorías
      </button>
      <button
        onClick={() => onViewChange('services')}
        className={`text-2xs px-3 py-1 font-bold transition-all duration-200 ease-in-out ${
          activeView === 'services'
            ? 'text-dark-primary bg-accent-primary'
            : 'text-accent-primary hover-neon-text'
        }`}
      >
        Servicios
      </button>
    </div>
  );
}
