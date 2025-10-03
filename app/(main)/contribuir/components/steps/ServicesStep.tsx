import FlexBox from '@/app/components/ui/containers/FlexBox';
import { useContributionStore } from '../../store/useContributionStore';
import ToggleInput from '@/app/components/ui/inputs/Toggle';

const serviceLabels = {
  transport: 'Transporte',
  store: 'Tienda',
  wifi: 'Internet',
  bathroom: 'Baño',
};

export default function ServicesStep() {
  const { services, updateFormField } = useContributionStore();

  const handleServiceChange = (
    service: keyof typeof services,
    checked: boolean
  ) => {
    updateFormField('services', { ...services, [service]: checked });
  };

  return (
    <FlexBox className="h-full" align="center" justify="center">
      <div className="w-full">
        <h2 className="text-md mb-xl font-oxanium text-center">
          selecciona los disponibles
        </h2>
        <FlexBox wrap="wrap" justify="around" className="h-full" align="center">
          {Object.entries(services).map(([key, value]) => {
            const service = key as keyof typeof services;
            return (
              <ToggleInput
                key={service}
                type="checkbox"
                id={`service-${service}`}
                name="services"
                value={service}
                checked={value}
                onChange={(e) => handleServiceChange(service, e.target.checked)}
                text={serviceLabels[service]}
              />
            );
          })}
        </FlexBox>
      </div>
    </FlexBox>
  );
}
