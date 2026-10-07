import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { Unit, WeatherData } from '../types/weather';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: Unit;
}

export default function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const condition = getWeatherCondition(data.current.weatherCode);
  const Icon = condition.icon;
  const metrics = [
    { label: 'Umidade', value: data.current.humidity, suffix: '%' },
    { label: 'Vento', value: data.current.windSpeed, suffix: ' km/h' },
    { label: 'Press\u00e3o', value: data.current.pressure, suffix: ' hPa' },
    { label: 'Precipita\u00e7\u00e3o', value: data.current.precipitation, suffix: ' mm' },
  ];

  return (
    <section aria-label="Clima atual" className="py-8 text-white sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="min-w-0 max-w-full">
          <p className="mb-2 text-sm text-white/70">Clima atual</p>
          <h2 className="text-3xl font-semibold [overflow-wrap:anywhere] sm:text-4xl">
            {data.city.name}
          </h2>
          <p className="mt-2 text-sm text-white/70 [overflow-wrap:anywhere]">
            {[data.city.admin1, data.city.country].filter(Boolean).join(', ')}
          </p>
        </div>
        <div className="flex min-w-0 max-w-full items-center gap-4">
          <Icon aria-hidden="true" size={48} className="shrink-0 text-sun" />
          <div className="min-w-0">
            <p className="text-5xl font-semibold tabular-nums [overflow-wrap:anywhere] sm:text-6xl">
              {formatTemperature(data.current.temperature, unit)}
            </p>
            <p className="mt-2 text-sm text-white/70 [overflow-wrap:anywhere]">{condition.label}</p>
          </div>
        </div>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-white/10 pt-6 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="min-w-0">
            <dt className="text-sm text-white/70">{metric.label}</dt>
            <dd className="mt-1 break-words text-lg font-medium tabular-nums">
              {Number.isFinite(metric.value) ? `${metric.value}${metric.suffix}` : '\u2014'}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
