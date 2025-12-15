import WarningIcon from '@/app/components/ui/svgs/WarningIcon';
import Button from '@/app/components/ui/Button';
import { useNavigationStore } from '@/contribuir/stores/useNavigationStore';

export default function NoTypeSelectedStep() {
  const { setCurrentStep } = useNavigationStore();
  function handleFormNavigation() {
    setCurrentStep(1);
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <p className="text-md font-oxanium mb-xl text-center">
        Selecciona un tipo de comunidad.
      </p>
      <figure className="text-error neon-effect h-[15rem] w-[15rem]">
        <WarningIcon />
      </figure>
      <Button
        variant="secondary"
        className="mt-xl"
        onClick={handleFormNavigation}
      >
        seleccionar
      </Button>
    </div>
  );
}
