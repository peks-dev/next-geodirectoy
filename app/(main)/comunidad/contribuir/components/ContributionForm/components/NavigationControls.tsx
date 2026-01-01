'use client';
import { motion } from 'motion/react';
import Button from '@/app/components/ui/Button';
import { TriangleIcon, CloseIcon, SendIcon } from '@/app/components/ui/svgs/';
import { useCustomNavigation } from '@/lib/hooks/useNavigation';
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
  const { navigate } = useCustomNavigation();
  const { openModal } = useModalStore();

  const handleCloseForm = () => {
    openModal({
      title: 'salir del formulario',
      content: 'perderás todos los datos que hallas ingresado',
      confirmButton: {
        text: 'si, salir',
        variant: 'primary',
        onClick: async () => {
          navigate('/perfil');
        },
      },
    });
  };

  // render component
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-background-secondary-dark flex items-center justify-between p-3"
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
    </motion.div>
  );
}
