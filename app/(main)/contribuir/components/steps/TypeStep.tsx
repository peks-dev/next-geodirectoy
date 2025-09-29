import WrapperStep from './WrapperStep';
import RetasIcon from '@/components/ui/svgs/RetasIcon';
import ClubIcon from '@/components/ui/svgs/ClubIcon';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import CornerIcon from '@/app/components/ui/svgs/Corner';
import { useContributionStore } from '../../store/useContributionStore';
import { type CommunityType } from '@/app/types/communityTypes';

export default function TypeStep() {
  const { type, updateFormField } = useContributionStore();
  const selectedType = type || '';

  const options = [
    { value: 'pickup' as CommunityType, label: 'Reta', Icon: RetasIcon },
    { value: 'club' as CommunityType, label: 'Club', Icon: ClubIcon },
  ];

  return (
    <WrapperStep className="flex flex-col justify-center gap-xl">
      <p className="text-center text-md">¿De que comunidad se trata?</p>
      <FlexBox align="center" justify="around">
        {options.map(({ value, label, Icon }) => (
          <label
            key={value}
            className={`group text-center relative p-4 ${
              selectedType === value
                ? 'text-accent-primary neon-effect'
                : 'text-foreground'
            }`}
          >
            <input
              type="radio"
              name="type"
              value={value}
              checked={selectedType === value}
              onChange={() => updateFormField('type', value)}
              className="sr-only"
            />

            <figure className="w-[100px] h-[100px]">
              <Icon />
            </figure>
            <span className="mt-4">{label}</span>
            <CornerIcon
              position="top-left"
              size="small"
              variant="interactive"
            />
            <CornerIcon
              position="top-right"
              size="small"
              variant="interactive"
            />
            <CornerIcon
              position="bottom-left"
              size="small"
              variant="interactive"
            />
            <CornerIcon
              position="bottom-right"
              size="small"
              variant="interactive"
            />
          </label>
        ))}
      </FlexBox>
    </WrapperStep>
  );
}
