import type { Schedule } from '@/app/types/communityTypes';
import ClockIcon from '../../ui/svgs/ClockIcon';

interface Props {
  data: Schedule;
  children?: React.ReactNode; // para el boton de eliminar
}

export default function ScheduleItem({ data, children }: Props) {
  return (
    <li className=" p-2.5 border-2 border-border w-full flex items-stretch justify-between gap-sm">
      <div className="bg-light-tertiary p-sm grow text-dark-primary">
        <p className="text-sm ">{data.days.join(', ')}</p>
        <div className="flex items-center gap-md mt-1">
          <figure className="w-[20px] h-[20px]">
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
