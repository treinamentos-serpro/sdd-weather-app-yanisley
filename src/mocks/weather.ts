import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    country: 'Brasil',
    admin1: 'São Paulo',
    latitude: -23.5505,
    longitude: -46.6333,
  },
  current: {
    temperature: 24,
    weatherCode: 2,
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    precipitation: 0,
    time: '2026-10-07T14:00:00',
  },
  forecast: [
    {
      date: '2026-10-07',
      min: 18,
      max: 27,
      weatherCode: 2,
      precipitationProbability: 20,
    },
    {
      date: '2026-10-08',
      min: 19,
      max: 28,
      weatherCode: 0,
      precipitationProbability: 5,
    },
    {
      date: '2026-10-09',
      min: 18,
      max: 25,
      weatherCode: 3,
      precipitationProbability: 30,
    },
    {
      date: '2026-10-10',
      min: 17,
      max: 23,
      weatherCode: 61,
      precipitationProbability: 80,
    },
    {
      date: '2026-10-11',
      min: 16,
      max: 24,
      weatherCode: 1,
      precipitationProbability: 10,
    },
  ],
};
