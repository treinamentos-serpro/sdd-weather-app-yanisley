import { formatDay } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: Unit;
}

export default function ForecastCard({ day, index, unit }: ForecastCardProps) {
  const label = formatDay(day.date, index);
  const condition = getWeatherCondition(day.weatherCode);
  const Icon = condition.icon;
  const rainProbability = Number.isFinite(day.precipitationProbability)
    ? `${day.precipitationProbability}%`
    : '\u2014';

  return (
    <article
      aria-label={label}
      className="flex h-full min-w-0 flex-col items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 font-sans text-white backdrop-blur-md sm:p-4"
    >
      <h3 className="text-sm font-semibold">
        <time dateTime={day.date}>{label}</time>
      </h3>
      <Icon
        role="img"
        aria-label={condition.label}
        size={32}
        className={day.weatherCode <= 1 ? 'shrink-0 text-sun' : 'shrink-0 text-accent-400'}
      />
      <dl className="w-full space-y-2 text-center text-sm">
        <div>
          <dt className="text-white/70">{'M\u00e1xima'}</dt>
          <dd className="break-words text-lg font-semibold tabular-nums">
            {formatTemperature(day.max, unit)}
          </dd>
        </div>
        <div>
          <dt className="text-white/70">{'M\u00ednima'}</dt>
          <dd className="break-words text-base tabular-nums">{formatTemperature(day.min, unit)}</dd>
        </div>
        <div>
          <dt className="text-white/70">Chance de chuva</dt>
          <dd className="tabular-nums">{rainProbability}</dd>
        </div>
      </dl>
    </article>
  );
}
