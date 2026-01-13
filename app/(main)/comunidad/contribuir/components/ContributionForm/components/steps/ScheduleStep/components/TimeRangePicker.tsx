import { useState, useEffect } from 'react';
import TimeInput from '@/app/components/ui/inputs/Time';

interface TimeRange {
  start: string;
  end: string;
}

interface TimeRangePickerProps {
  onChange: (time: TimeRange) => void;
  initialStart?: string;
  initialEnd?: string;
  startLabel?: string;
  endLabel?: string;
  wrapperClass?: string;
  inputWrapperClass?: string;
  separator?: string; // e.g., " a " o "-"
}

const TimeRangePicker = ({
  onChange,
  initialStart = '',
  initialEnd = '',
  startLabel = 'Hora de inicio',
  endLabel = 'Hora de fin',
  wrapperClass = '',
  inputWrapperClass = '',
}: TimeRangePickerProps) => {
  const [time, setTime] = useState<TimeRange>({
    start: initialStart,
    end: initialEnd,
  });

  useEffect(() => {
    onChange(time);
  }, [time, onChange]);

  const handleStartChange = (value: string) => {
    setTime((prev) => ({ ...prev, start: value }));
  };

  const handleEndChange = (value: string) => {
    setTime((prev) => ({ ...prev, end: value }));
  };

  return (
    <div
      className={`flex w-full items-center justify-between gap-3 ${wrapperClass}`.trim()}
    >
      <TimeInput
        label={startLabel}
        value={time.start}
        onChange={handleStartChange}
        wrapperClass={`${inputWrapperClass} flex-1`.trim()}
      />
      <TimeInput
        label={endLabel}
        value={time.end}
        onChange={handleEndChange}
        wrapperClass={`${inputWrapperClass} flex-1`.trim()}
      />
    </div>
  );
};

export default TimeRangePicker;
