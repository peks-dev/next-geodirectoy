'use client';

import { useState } from 'react';
import Button from '@/app/components/ui/Button';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import ScheduleConstructor from './components/ScheduleConstructor';
import ScheduleItem from '@/app/components/community/schedule/ScheduleItem';
import { useContributionStore } from '@/app/(main)/contribuir/stores/useContributionStore';

const StepSchedule = () => {
  const [constructorView, setConstructorView] = useState(false);
  const { schedule, removeSchedule } = useContributionStore();

  function toggleConstructorView() {
    setConstructorView(!constructorView);
  }

  return (
    <FlexBox direction="col" align="stretch" className="h-full w-full">
      <div className="grow">
        {constructorView ? (
          <ScheduleConstructor toggleConstructorView={setConstructorView} />
        ) : (
          <ul>
            {schedule.length === 0 ? (
              <p className="text-center text-sm">
                crea conjuntos de días con horarios
              </p>
            ) : (
              <FlexBox direction="col" align="center" className="gap-md">
                {schedule.map((item, index) => (
                  <ScheduleItem
                    key={index}
                    data={item}
                    onDelete={() => removeSchedule(index)}
                  />
                ))}
              </FlexBox>
            )}
          </ul>
        )}
      </div>
      <Button
        onClick={toggleConstructorView}
        id="open-constructor"
        variant={constructorView ? 'secondary' : 'primary'}
      >
        {constructorView ? 'cancelar' : 'agregar nuevo'}
      </Button>
    </FlexBox>
  );
};

export default StepSchedule;
