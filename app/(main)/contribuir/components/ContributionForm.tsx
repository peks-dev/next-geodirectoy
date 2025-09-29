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
      className="h-full gap-5 w-md m-auto"
    >
      <StepIndicator currentStep={currentStep} />

      <form
        className="w-full h-full grow transparent-container p-3 max-h-full overflow-y-auto"
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
