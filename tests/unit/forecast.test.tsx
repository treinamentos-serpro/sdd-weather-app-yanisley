import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ForecastCard from '../../src/components/ForecastCard';
import ForecastList from '../../src/components/ForecastList';
import { formatDay } from '../../src/lib/format';
import { formatTemperature, toFahrenheit } from '../../src/lib/temperature';
import { getWeatherCondition } from '../../src/lib/weatherCodes';
import { mockWeatherData } from '../../src/mocks/weather';

afterEach(cleanup);

describe('formatacao da previsao', () => {
  it.each([
    [0, 32],
    [100, 212],
    [-40, -40],
  ])('converte %s Celsius para %s Fahrenheit', (celsius, fahrenheit) => {
    expect(toFahrenheit(celsius)).toBe(fahrenheit);
  });

  it('arredonda temperaturas na unidade selecionada', () => {
    expect(formatTemperature(18.4, 'celsius')).toBe('18\u00b0C');
    expect(formatTemperature(18.4, 'fahrenheit')).toBe('65\u00b0F');
    expect(formatTemperature(-0.1, 'celsius')).toBe('0\u00b0C');
    expect(formatTemperature(Number.NaN, 'celsius')).toBe('\u2014');
  });

  it('rotula hoje, amanha e os dias seguintes sem deslocamento de fuso', () => {
    expect(formatDay('2026-10-07', 0)).toBe('Hoje');
    expect(formatDay('2026-10-08', 1)).toBe('Amanh\u00e3');
    expect(formatDay('2026-10-09', 2)).toBe('sex.');
    expect(formatDay('invalida', 2)).toBe('\u2014');
  });
});

describe('ForecastList e ForecastCard', () => {
  it('exibe cinco cards com rotulos e grid responsivo', () => {
    render(<ForecastList forecast={mockWeatherData.forecast} unit="celsius" />);

    expect(screen.getByRole('region', { name: 'Previs\u00e3o do tempo' })).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByRole('list')).toHaveClass(
      'grid',
      'grid-cols-2',
      'sm:grid-cols-3',
      'lg:grid-cols-5',
    );
    expect(screen.getByRole('heading', { name: 'Hoje' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Amanh\u00e3' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'sex.' })).toBeVisible();
  });

  it('exibe icone acessivel, maxima, minima e probabilidade de chuva', () => {
    render(<ForecastList forecast={mockWeatherData.forecast} unit="celsius" />);

    const today = within(screen.getByRole('article', { name: 'Hoje' }));
    expect(today.getByRole('img', { name: 'Parcialmente nublado' })).toBeVisible();
    expect(today.getByText('M\u00e1xima')).toBeVisible();
    expect(today.getByText('27\u00b0C')).toBeVisible();
    expect(today.getByText('M\u00ednima')).toBeVisible();
    expect(today.getByText('18\u00b0C')).toBeVisible();
    expect(today.getByText('Chance de chuva')).toBeVisible();
    expect(today.getByText('20%')).toBeVisible();
  });

  it('converte todos os cards ao receber Fahrenheit sem modificar os dados', () => {
    const original = structuredClone(mockWeatherData.forecast);
    const { rerender } = render(
      <ForecastList forecast={mockWeatherData.forecast} unit="celsius" />,
    );

    rerender(<ForecastList forecast={mockWeatherData.forecast} unit="fahrenheit" />);

    for (const [index, day] of original.entries()) {
      const card = within(screen.getAllByRole('article')[index]);
      expect(card.getByText(`${Math.round((day.max * 9) / 5 + 32)}\u00b0F`)).toBeVisible();
      expect(card.getByText(`${Math.round((day.min * 9) / 5 + 32)}\u00b0F`)).toBeVisible();
    }
    expect(mockWeatherData.forecast).toEqual(original);
  });

  it('informa quando nao ha previsao', () => {
    render(<ForecastList forecast={[]} unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma previs\u00e3o dispon\u00edvel.');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('usa fallback para codigo desconhecido e valores ausentes', () => {
    render(
      <ForecastCard
        day={{
          date: '2026-10-07',
          min: Number.NaN,
          max: Number.NaN,
          weatherCode: -1,
          precipitationProbability: Number.NaN,
        }}
        index={0}
        unit="celsius"
      />,
    );

    expect(screen.getByRole('img', { name: 'Condi\u00e7\u00e3o desconhecida' })).toBeVisible();
    expect(screen.getAllByText('\u2014')).toHaveLength(3);
  });

  it.each([
    [0, 'C\u00e9u limpo'],
    [45, 'Nevoeiro'],
    [51, 'Garoa leve'],
    [61, 'Chuva leve'],
    [71, 'Neve leve'],
    [80, 'Pancadas de chuva leves'],
    [95, 'Trovoada'],
    [999, 'Condi\u00e7\u00e3o desconhecida'],
  ])('mapeia o codigo %s para %s', (code, label) => {
    expect(getWeatherCondition(code).label).toBe(label);
  });
});
