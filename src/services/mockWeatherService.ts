import { mockWeatherData } from '../mocks/weather';
import type { WeatherData } from '../types/weather';

export async function searchMockWeather(city: string): Promise<WeatherData | null> {
  await new Promise<void>((resolve) => setTimeout(resolve, 400));
  const matches =
    city.trim().localeCompare(mockWeatherData.city.name, 'pt-BR', {
      sensitivity: 'base',
    }) === 0;
  return matches ? mockWeatherData : null;
}
