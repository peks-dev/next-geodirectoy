import ScheduleItem from '@/comunidad/components/ScheduleItem';
import HeadingSection from '../HeadingSection';
import type { Schedule } from '@/comunidad/types';
import SectionWrapper from './SectionWrapper';

export default function ScheduleSection({
  schedules,
}: {
  schedules: Schedule[];
}) {
  return (
    <SectionWrapper className="h-full w-full">
      <HeadingSection text="horarios" />
      <ul className="grow">
        {schedules.map((item, index) => (
          <ScheduleItem key={index} data={item} />
        ))}
      </ul>
    </SectionWrapper>
  );
}
