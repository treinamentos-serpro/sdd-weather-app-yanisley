import { describe, expect, it } from 'vitest';
import { mockWeatherData } from '../../src/mocks/weather';

describe('mockWeatherData', () => {
  it('fornece cidade e clima atual com temperaturas em Celsius', () => {
    expect(mockWeatherData.city.name).toBe('São Paulo');
    expect(mockWeatherData.current).toEqual({
      temperature: 24,
      weatherCode: 2,
      humidity: 65,
      windSpeed: 12,
      pressure: 1013,
      precipitation: 0,
      time: '2026-10-07T14:00:00',
    });
  });

  it('fornece cinco dias consecutivos a partir da data do clima atual', () => {
    expect(mockWeatherData.forecast).toHaveLength(5);

    const currentDate = mockWeatherData.current.time.split('T')[0];
    const firstDay = new Date(`${currentDate}T00:00:00Z`);

    for (const [index, day] of mockWeatherData.forecast.entries()) {
      const expectedDate = new Date(firstDay);
      expectedDate.setUTCDate(firstDay.getUTCDate() + index);

      expect(day.date).toBe(expectedDate.toISOString().slice(0, 10));
      expect(day.min).toBeLessThanOrEqual(day.max);
      expect(day.precipitationProbability).toBeGreaterThanOrEqual(0);
      expect(day.precipitationProbability).toBeLessThanOrEqual(100);
    }
  });
});
