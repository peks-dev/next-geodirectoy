import type { Schedule } from '@/app/types/communityTypes';
import ClockIcon from '../../ui/svgs/ClockIcon';

interface Props {
  data: Schedule;
  children?: React.ReactNode; // para el boton de eliminar
}

export default function ScheduleItem({ data, children }: Props) {
  return (
    <li className="border-border gap-sm flex w-full items-stretch justify-between border-2 p-2.5">
      <div className="bg-light-tertiary p-sm text-dark-primary grow">
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
      {children}
    </li>
  );
}
