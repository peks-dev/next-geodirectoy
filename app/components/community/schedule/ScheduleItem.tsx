import type { Schedule } from '@/app/types/communityTypes';
import ItemContainer from '../../ui/containers/ItemList';
import ClockIcon from '../../ui/svgs/ClockIcon';

interface Props {
  data: Schedule;
  onDelete?: () => void;
}

export default function ScheduleItem({ data, onDelete }: Props) {
  return (
    <ItemContainer deleteFn={onDelete && onDelete}>
      <div>
        <p className="text-sm">{data.days.join(', ')}</p>
        <div className="gap-md mt-1 flex items-center">
          <figure className="h-[20px] w-[20px]">
            <ClockIcon />
          </figure>
          <p>
            {data.time.start} - {data.time.end}
          </p>
        </div>
      </div>
    </ItemContainer>
  );
}
