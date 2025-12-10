'use client';
import Button from '@/app/components/ui/Button';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import { TriangleIcon, CloseIcon, SendIcon } from '@/app/components/ui/svgs/';

import { useRouter } from 'next/navigation';
import { useModalStore } from '@/app/components/ui/Modal';

interface Props {
  prevStep: () => void;
  nextStep: () => void;
  currentStep: number;
  isLoading: boolean;
}

export default function NavigationControls({
  prevStep,
  nextStep,
  currentStep,
  isLoading,
}: Props) {
  // close form logic
  const router = useRouter();
  const { openModal } = useModalStore();

  const handleCloseForm = () => {
    openModal({
      title: 'salir del formulario',
      content: 'perderás todos los datos que hallas ingresado',
      confirmButton: {
        text: 'si, salir',
        variant: 'primary',
        onClick: async () => {
          router.push('/');
        },
      },
    });
  };

  // render component
  return (
    <FlexBox
      align="center"
      justify="between"
      className="bg-background-secondary-dark p-3"
    >
      <Button variant="icon" onClick={prevStep}>
        <TriangleIcon />
      </Button>

      <Button variant="icon" onClick={handleCloseForm} size="xsm">
        <CloseIcon />
      </Button>

      {currentStep <= 6 && (
        <Button variant="icon" onClick={nextStep} className="rotate-180">
          <TriangleIcon />
        </Button>
      )}

      {currentStep === 7 && (
        <Button
          variant="icon"
          type="submit"
          form="contribution-form"
          loading={isLoading}
        >
          <SendIcon />
        </Button>
      )}
    </FlexBox>
  );
}
