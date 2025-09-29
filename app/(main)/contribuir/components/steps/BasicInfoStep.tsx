import Input from '@/app/components/ui/inputs/Text';
import Textarea from '@/app/components/ui/inputs/Textarea';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import { useContributionStore } from '../../store/useContributionStore';
export default function BasicInfoStep() {
  const { name, description, updateFormField } = useContributionStore();

  return (
    <FlexBox direction="col" className="h-full gap-xl">
      <label>
        <Input
          type="text"
          placeholder="Nombre de la cancha"
          value={name}
          onChange={(e) => updateFormField('name', e.target.value)}
        />
      </label>
      <label className="grow">
        <Textarea
          placeholder="Descripción de la comunidad, como es, cual es su distintivo?"
          maxLength={500}
          required
          className="h-full"
          value={description}
          onChange={(e) => updateFormField('description', e.target.value)}
        />
      </label>
    </FlexBox>
  );
}
