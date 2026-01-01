'use client';
import { motion } from 'motion/react';
import { useMatrixEffect } from '@/app/(auth)/components/AuthForm/hooks/useMatrixEffect';
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

  // Efecto matrix en el título actual
  const currentLabel = stepLabels[currentStep - 1];
  const matrixLabel = useMatrixEffect(currentLabel);

  const handleStepClick = (stepIndex: number) => {
    // stepIndex es 0-6, los steps son 1-7
    const actualStep = (stepIndex + 1) as StepNumber;
    setCurrentStep(actualStep);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <motion.h2
        key={currentStep} // Key para resetear animación en cada cambio
        className="heading text-md neon-effect"
        initial={{ opacity: 0, x: -15 }}
        animate={{
          opacity: 1,
          x: [-15, 0, 3, -3, 3, 0],
        }}
        transition={{
          duration: 0.7,
          ease: 'easeOut',
          x: { duration: 0.5, times: [0, 0.4, 0.55, 0.7, 0.85, 1] },
        }}
      >
        {matrixLabel}
      </motion.h2>

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
