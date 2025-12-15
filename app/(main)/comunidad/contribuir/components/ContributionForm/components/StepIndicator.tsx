'use client';

import {
  useNavigationStore,
  type StepNumber,
} from '../../../stores/useNavigationStore';

interface StepIndicatorProps {
  currentStep: number; // 1-7 (pasos visibles para el usuario)
}

const stepLabels = [
  'Tipo',
  'Información',
  'Ubicación',
  'Imágenes',
  'Horarios',
  'Servicios',
  'Detalles',
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { setCurrentStep } = useNavigationStore();

  const handleStepClick = (stepIndex: number) => {
    // stepIndex es 0-6, los steps son 1-7
    const actualStep = (stepIndex + 1) as StepNumber;
    setCurrentStep(actualStep);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="heading text-md neon-effect">
        {stepLabels[currentStep - 1]}
      </h2>
      <ul className="flex w-3/5 justify-between">
        {stepLabels.map((label, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => handleStepClick(index)}
              className={`border-foreground hover:bg-foreground/10 h-[clamp(1.8rem,3vw,3rem)] w-[clamp(1.8rem,3vw,3rem)] border-(length:--border-xs) shadow-[inset_0_2px_4px_#fefefe80] transition-colors duration-100 ${
                index === currentStep - 1 ? 'bg-foreground' : ''
              }`}
              aria-label={`Ir al paso ${index + 1}: ${label}`}
              title={`Ir al paso ${index + 1}: ${label}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
