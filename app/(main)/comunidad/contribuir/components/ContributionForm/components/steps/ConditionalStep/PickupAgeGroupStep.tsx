import FlexBox from '@/app/components/ui/containers/FlexBox';
import ToggleInput from '@/app/components/ui/inputs/Toggle';
import { useContributionStore } from '@/contribuir/stores/useContributionStore';
import { AGE_GROUP_OPTIONS } from './constants';
import type { AgeGroup } from '@/app/types/communityTypes';

export default function PickupAgeGroupStep() {
  const { age_group, updateFormField } = useContributionStore();

  return (
    <FlexBox className="h-full" align="center">
      <div className="m-auto">
        <h2 className="text-md font-oxanium mb-xl text-center">
          Selecciona la edad predominante
        </h2>
        <FlexBox wrap="wrap" justify="around" className="gap-md">
          {AGE_GROUP_OPTIONS.map((option) => (
            <ToggleInput
              key={option.value}
              type="radio"
              id={`age-group-${option.value}`}
              name="age_group"
              value={option.value}
              checked={age_group === option.value}
              onChange={(e) =>
                updateFormField('age_group', e.target.value as AgeGroup)
              }
              text={option.label}
              wrapperClass="mb-2"
            />
          ))}
        </FlexBox>
      </div>
    </FlexBox>
  );
}
