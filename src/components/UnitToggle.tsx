import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

const options: { unit: Unit; label: string }[] = [
  { unit: 'celsius', label: '\u00b0C' },
  { unit: 'fahrenheit', label: '\u00b0F' },
];

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      className="inline-flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1 font-sans backdrop-blur-md"
    >
      {options.map((option) => (
        <button
          key={option.unit}
          type="button"
          aria-pressed={unit === option.unit}
          onClick={() => onChange(option.unit)}
          className="h-11 w-12 rounded-md text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 aria-pressed:bg-accent-500 aria-pressed:text-night-900 aria-pressed:hover:bg-accent-400"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
