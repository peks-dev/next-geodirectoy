'use client';

import { useEffect, useRef } from 'react';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import StepIndicator from './components/StepIndicator';
import NavigationControls from './components/NavigationControls';
import StepRenderer from './components/StepRenderer';
import { useNavigationStore } from './store/useNavigationStore';
import { useContributionStore } from './store/useContributionStore';
import { useFormSubmission } from './hooks/useFormSubmission';
import {
  showSuccessToast,
  handleSubmissionError,
} from '@/app/components/toast/notificationService';
import type { CommunityFormData } from '@/app/types/communityTypes';

interface Props {
  initialData?: CommunityFormData | null;
}

export default function ContributionForm({ initialData }: Props) {
  const { currentStep, nextStep, prevStep, resetToStart } =
    useNavigationStore();
  const { reset, setFormData } = useContributionStore();
  const { isLoading, handleSubmit: performSubmit } = useFormSubmission();

  // 1. Usamos useRef para garantizar que la inicialización ocurra solo una vez.
  const isInitialized = useRef(false);

  // 2. Lógica de inicialización del store.
  // Esto se ejecuta en el primer render, antes del useEffect.
  if (initialData && !isInitialized.current) {
    // Sincronizamos el store con los datos iniciales del servidor.
    setFormData(initialData);
    // Marcamos como inicializado para que no se vuelva a ejecutar.
    isInitialized.current = true;
  }

  // 3. El useEffect ahora solo se encarga de la limpieza.
  useEffect(() => {
    return () => {
      reset();
      resetToStart();
    };
  }, [reset, resetToStart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await performSubmit();
      if (result.success) {
        showSuccessToast(
          `Comunidad ${initialData ? 'actualizada' : 'registrada'} con éxito`,
          result.message
        );
      }
    } catch (error) {
      handleSubmissionError(error);
    }
  };

  // El resto del componente permanece igual...
  return (
    <FlexBox
      direction="col"
      align="stretch"
      className="m-auto h-full w-md gap-5"
    >
      <StepIndicator currentStep={currentStep} />
      <form
        className={`transparent-container h-full max-h-full w-full grow overflow-y-auto ${
          currentStep === 3 ? '' : 'p-3'
        }`}
        onSubmit={handleSubmit}
        id="contribution-form"
      >
        <StepRenderer currentStep={currentStep} />
      </form>
      <NavigationControls
        prevStep={prevStep}
        nextStep={nextStep}
        currentStep={currentStep}
        isLoading={isLoading}
      />
    </FlexBox>
  );
}
