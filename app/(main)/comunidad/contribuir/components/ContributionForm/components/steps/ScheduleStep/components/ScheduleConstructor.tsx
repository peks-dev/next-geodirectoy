'use client';
import { useState } from 'react';
import { showErrorToast } from '@/shared/notifications';
import { useContributionStore } from '@/contribuir/stores/useContributionStore';
import type { Schedule } from '@/comunidad/types';
import DaysRangePicker from './DaysRangePicker';
import TimeRangePicker from './TimeRangePicker';

import Button from '@/app/components/ui/Button';
interface Props {
  toggleConstructorView: (value: boolean) => void;
}

export default function ScheduleConstructor({ toggleConstructorView }: Props) {
  const { updateFormField, schedule } = useContributionStore();
  const [selectedDay, setSelectedDay] = useState<string[]>([]);
  const [time, setTime] = useState({ start: '', end: '' }); // Cambiado a start/end

  function handleAddSchedule() {
    if (selectedDay.length === 0) {
      showErrorToast('Error de validación', 'Selecciona al menos un día');
      return;
    }

    if (time.start === '' || time.end === '') {
      showErrorToast(
        'Error de validación',
        'Ingresa hora de inicio y hora final'
      );
      return;
    }

    // Convertir a Date para comparar
    const start = new Date(`1970/01/01 ${time.start}`);
    const end = new Date(`1970/01/01 ${time.end}`);

    if (start >= end) {
      showErrorToast('Error de validación', 'Horario inválido');
      return;
    }

    // Crear el objeto de horario según la nueva estructura
    const newScheduleItem: Schedule = {
      // Importar type Schedule si no está
      days: selectedDay,
      time: {
        start: time.start,
        end: time.end,
      },
    };

    updateFormField('schedule', [...schedule, newScheduleItem]);
    toggleConstructorView(false);
  }

  function handleDays(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, type, checked } = e.target;
    if (type === 'checkbox') {
      setSelectedDay((prevSelectedDays) => {
        if (checked) {
          return [...prevSelectedDays, value];
        } else {
          return prevSelectedDays.filter((day) => day !== value);
        }
      });
    }
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <DaysRangePicker
        selectedDays={selectedDay}
        handleInputChange={handleDays}
      />
      <TimeRangePicker
        onChange={(newTime) => setTime(newTime)}
        initialStart={time.start}
        initialEnd={time.end}
      />

      <Button onClick={handleAddSchedule} id="add-schedule">
        agregar
      </Button>
    </div>
  );
}
