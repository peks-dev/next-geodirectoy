import type { Schedule } from '@/comunidad/types';
import ItemContainer from '../../../components/ui/containers/ItemList';
import ClockIcon from '../../../components/ui/svgs/ClockIcon';

interface Props {
  data: Schedule;
  onDelete?: () => void;
}

export default function ScheduleItem({ data, onDelete }: Props) {
  return (
    <ItemContainer deleteFn={onDelete && onDelete}>
      <div>
        <p className="text-sm font-bold">{data.days.join(', ')}</p>
        <div className="gap-md mt-2 flex items-center">
          <figure className="h-[20px] w-[20px]">
            <ClockIcon />
          </figure>
          <p className="text-base">
            {data.time.start} - {data.time.end}
          </p>
        </div>
      </div>
    </ItemContainer>
  );
}
