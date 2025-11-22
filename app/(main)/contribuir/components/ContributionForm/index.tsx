'use client';

import { useEffect, useRef } from 'react';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import StepIndicator from './components/StepIndicator';
import NavigationControls from './components/NavigationControls';
import StepRenderer from './components/StepRenderer';
import { useNavigationStore } from './store/useNavigationStore';
import { useContributionStore } from './store/useContributionStore';
import { useFormSubmission } from './hooks/useFormSubmission';
import { useCommunitiesProfileStore } from '@/app/(main)/perfil/stores/useCommunitiesProfileStore';
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
  const addCommunity = useCommunitiesProfileStore(
    (state) => state.addCommunity
  );

  const isInitialized = useRef(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      isInitialized.current = true;
    }
  }, [initialData, setFormData]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      reset();
      resetToStart();
      isInitialized.current = false;
    };
  }, [reset, resetToStart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await performSubmit();
      if (result.success && result.data) {
        addCommunity(result.data);
        showSuccessToast(
          `Comunidad ${initialData ? 'actualizada' : 'registrada'} con éxito`,
          result.message
        );
      }
    } catch (error) {
      handleSubmissionError(error);
    }
  };

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
