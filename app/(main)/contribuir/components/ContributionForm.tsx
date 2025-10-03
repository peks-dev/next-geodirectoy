'use client';
import { useEffect } from 'react';
import FlexBox from '@/app/components/ui/containers/FlexBox';
// form components
import StepIndicator from './StepIndicator';
import NavigationControls from './NavigationControls';
import StepRenderer from './StepRenderer';
// hooks
import { useNavigationStore } from '../store/useNavigationStore';
import { useContributionStore } from '../store/useContributionStore';

export default function ContributionForm() {
  const { currentStep, nextStep, prevStep, resetToStart } =
    useNavigationStore();
  const { reset } = useContributionStore();

  // Limpiar todo cuando el componente se desmonte
  useEffect(() => {
    return () => {
      reset(); // Limpia todos los datos del formulario
      resetToStart(); // Regresa al paso inicial
    };
  }, [reset, resetToStart]);

  return (
    <FlexBox
      direction="col"
      align="stretch"
      className="m-auto h-full w-md gap-5"
    >
      <StepIndicator currentStep={currentStep} />

      <form
        className={`transparent-container h-full max-h-full w-full grow overflow-y-auto ${currentStep === 3 ? '' : 'p-3'}`} //evitar padding en LocationStep
        onSubmit={() => console.log('enviado prro')}
      >
        <StepRenderer currentStep={currentStep} />
      </form>

      <NavigationControls
        prevStep={prevStep}
        nextStep={nextStep}
        currentStep={currentStep}
      />
    </FlexBox>
  );
}
