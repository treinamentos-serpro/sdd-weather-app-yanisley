import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  return (
    <section aria-label={'Previs\u00e3o do tempo'} className="w-full min-w-0">
      {forecast.length === 0 ? (
        <p role="status" className="font-sans text-sm text-white/70">
          {'Nenhuma previs\u00e3o dispon\u00edvel.'}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {forecast.map((day, index) => (
            <li key={day.date} className="min-w-0">
              <ForecastCard day={day} index={index} unit={unit} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
