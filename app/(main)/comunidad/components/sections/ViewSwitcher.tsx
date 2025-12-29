import { motion } from 'motion/react';

interface Props {
  activeView: 'categories' | 'services';
  onViewChange: (view: 'categories' | 'services') => void;
}

export default function ViewSwitcher({ activeView, onViewChange }: Props) {
  return (
    <div className="bg-background-interactive relative flex items-center self-center p-1">
      {/* Indicador animado */}
      <motion.div
        layoutId="active-indicator"
        className="bg-accent-primary absolute rounded-sm"
        style={{
          left: activeView === 'categories' ? '4px' : 'calc(50% + 4px)',
          right: activeView === 'categories' ? 'calc(50% - 4px)' : '4px',
          height: 'calc(100% - 8px)',
          top: '4px',
        }}
        transition={{
          duration: 0.2,
          ease: [0.25, 0.1, 0.25, 1],
          layout: { duration: 0.2 },
        }}
      />

      {/* Botones */}
      <button
        onClick={() => onViewChange('categories')}
        className={`text-2xs relative z-10 cursor-pointer px-3 py-1 font-bold transition-colors duration-200 ${
          activeView === 'categories'
            ? 'text-dark-primary'
            : 'text-accent-primary hover-neon-text'
        }`}
      >
        Categorías
      </button>
      <button
        onClick={() => onViewChange('services')}
        className={`text-2xs relative z-10 cursor-pointer px-3 py-1 font-bold transition-colors duration-200 ${
          activeView === 'services'
            ? 'text-dark-primary'
            : 'text-accent-primary hover-neon-text'
        }`}
      >
        Servicios
      </button>
    </div>
  );
}
