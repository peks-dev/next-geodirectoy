import { useContributionStore } from '@/contribuir/stores/useContributionStore';
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
    <div className="flex h-full items-center justify-center">
      <div className="w-full">
        <h2 className="text-md mb-xl font-oxanium text-center">
          selecciona los disponibles
        </h2>
        <div className="flex h-full flex-wrap items-center justify-around">
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
        </div>
      </div>
    </div>
  );
}
