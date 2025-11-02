import ScheduleItem from '@/app/components/community/schedule/ScheduleItem';
import HeadingSection from '../HeadingSection';
import type { Schedule } from '@/app/types/communityTypes';

export default function ScheduleSection({
  schedules,
}: {
  schedules: Schedule[];
}) {
  return (
    <div className="h-full w-full">
      <HeadingSection text="horarios" />
      <ul className="grow">
        {schedules.map((item, index) => (
          <ScheduleItem key={index} data={item} />
        ))}
      </ul>
    </div>
  );
}
