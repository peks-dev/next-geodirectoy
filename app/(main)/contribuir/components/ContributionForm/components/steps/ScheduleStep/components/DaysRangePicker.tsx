import ToggleInput from '@/app/components/ui/inputs/Toggle';

interface Props {
  selectedDays: string[]; // Array de días seleccionados (para marcar los checkboxes)
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Actualizado
}

const DaysRangePicker = ({ selectedDays, handleInputChange }: Props) => {
  const days = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'domingo',
  ];
  return (
    <div>
      <p className="mb-lg text-center text-sm">selecciona los días</p>
      <ul className="gap-md flex flex-wrap items-center justify-center">
        {days.map((day, index) => (
          <li key={index}>
            <ToggleInput
              id={day}
              type="checkbox"
              text={day}
              value={day}
              name={'days'}
              onChange={handleInputChange}
              checked={selectedDays.includes(day)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DaysRangePicker;
