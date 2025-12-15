'use client';

import { useState } from 'react';
import Button from '@/app/components/ui/Button';

import ScheduleConstructor from './components/ScheduleConstructor';
import ScheduleItem from '@/comunidad/components/ScheduleItem';
import { useContributionStore } from '@/contribuir/stores/useContributionStore';

const StepSchedule = () => {
  const [constructorView, setConstructorView] = useState(false);
  const { schedule, removeSchedule } = useContributionStore();

  function toggleConstructorView() {
    setConstructorView(!constructorView);
  }

  return (
    <div className="flex h-full w-full flex-col items-stretch">
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
              <div className="gap-md flex flex-col items-center">
                {schedule.map((item, index) => (
                  <ScheduleItem
                    key={index}
                    data={item}
                    onDelete={() => removeSchedule(index)}
                  />
                ))}
              </div>
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
    </div>
  );
};

export default StepSchedule;
