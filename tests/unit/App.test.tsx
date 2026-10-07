import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import { mockWeatherData } from '../../src/mocks/weather';
import { searchMockWeather } from '../../src/services/mockWeatherService';
import type { WeatherData } from '../../src/types/weather';

vi.mock('../../src/services/mockWeatherService', () => ({ searchMockWeather: vi.fn() }));

afterEach(cleanup);
beforeEach(() => vi.resetAllMocks());

async function submitCity(city = 'São Paulo') {
  const user = userEvent.setup();
  await user.type(screen.getByRole('searchbox'), city);
  await user.click(screen.getByRole('button', { name: 'Buscar' }));
  return user;
}

describe('App', () => {
  it('exibe marca, busca, unidades e estado inicial', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'WeatherView' })).toBeVisible();
    expect(screen.getByRole('search')).toBeVisible();
    expect(screen.getByRole('button', { name: '\u00b0C', pressed: true })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade selecionada' })).toBeVisible();
  });

  it('mostra loading, bloqueia a busca e depois exibe o mock', async () => {
    let resolveWeather: (data: WeatherData) => void = () => {};
    vi.mocked(searchMockWeather).mockReturnValue(
      new Promise((resolve) => {
        resolveWeather = resolve;
      }),
    );
    render(<App />);
    await submitCity();
    expect(screen.getByRole('status')).toHaveTextContent('Carregando');
    expect(screen.getByRole('searchbox')).toBeDisabled();
    resolveWeather(mockWeatherData);
    expect(await screen.findByRole('heading', { name: 'São Paulo' })).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByRole('searchbox')).toBeEnabled();
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus());
    expect(screen.getByText(/Clima de São Paulo carregado/)).toHaveAttribute('aria-live', 'polite');
  });

  it('converte clima atual e todos os dias sem refazer a busca nem alterar o mock', async () => {
    vi.mocked(searchMockWeather).mockResolvedValue(mockWeatherData);
    const original = structuredClone(mockWeatherData);
    render(<App />);
    const user = await submitCity();
    await screen.findByRole('heading', { name: 'São Paulo' });
    await user.click(screen.getByRole('button', { name: '\u00b0F' }));
    expect(
      within(screen.getByRole('region', { name: 'Clima atual' })).getByText('75\u00b0F'),
    ).toBeVisible();
    for (const [index, day] of mockWeatherData.forecast.entries()) {
      const card = within(screen.getAllByRole('article')[index]);
      expect(card.getByText(`${Math.round((day.max * 9) / 5 + 32)}\u00b0F`)).toBeVisible();
      expect(card.getByText(`${Math.round((day.min * 9) / 5 + 32)}\u00b0F`)).toBeVisible();
    }
    await user.click(screen.getByRole('button', { name: '\u00b0C' }));
    expect(
      within(screen.getByRole('region', { name: 'Clima atual' })).getByText('24\u00b0C'),
    ).toBeVisible();
    expect(searchMockWeather).toHaveBeenCalledTimes(1);
    expect(mockWeatherData).toEqual(original);
  });

  it('exibe estado vazio para busca sem resultados', async () => {
    vi.mocked(searchMockWeather).mockResolvedValue(null);
    render(<App />);
    await submitCity('Recife');
    expect(await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus());
    expect(screen.getByText('Nenhuma cidade encontrada.')).toHaveAttribute('aria-atomic', 'true');
  });

  it('exibe erro e tenta novamente com a mesma cidade', async () => {
    vi.mocked(searchMockWeather)
      .mockRejectedValueOnce(new Error('Falha simulada'))
      .mockResolvedValueOnce(mockWeatherData);
    render(<App />);
    const user = await submitCity();
    expect(await screen.findByRole('alert')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByRole('heading', { name: 'São Paulo' })).toBeVisible();
    expect(searchMockWeather).toHaveBeenNthCalledWith(2, 'São Paulo');
  });

  it('oferece um link para pular o header como primeiro controle de teclado', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.tab();
    const skipLink = screen.getByRole('link', { name: 'Ir para o conte\u00fado' });
    expect(skipLink).toHaveFocus();
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
  });

  it('preserva o foco no seletor de unidade enquanto a busca termina', async () => {
    let resolveWeather: (data: WeatherData) => void = () => {};
    vi.mocked(searchMockWeather).mockReturnValue(
      new Promise((resolve) => {
        resolveWeather = resolve;
      }),
    );
    render(<App />);
    const user = await submitCity();
    const fahrenheit = screen.getByRole('button', { name: '\u00b0F' });
    await user.click(fahrenheit);
    resolveWeather(mockWeatherData);
    await screen.findByRole('heading', { name: 'São Paulo' });
    expect(fahrenheit).toHaveFocus();
  });
});
