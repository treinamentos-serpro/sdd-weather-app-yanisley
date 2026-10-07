import { CloudSun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { searchMockWeather } from './services/mockWeatherService';
import type { Unit, WeatherData } from './types/weather';

type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; city: string }
  | { status: 'success'; data: WeatherData };

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [state, setState] = useState<WeatherState>({ status: 'idle' });
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!['success', 'empty', 'error'].includes(state.status)) return;
    const active = document.activeElement;
    if (
      active === document.body ||
      active?.closest('[role="search"]') ||
      (active && mainRef.current?.contains(active))
    ) {
      mainRef.current?.focus();
    }
  }, [state]);

  const announcement =
    state.status === 'success'
      ? `Clima de ${state.data.city.name} carregado. Previs\u00e3o de ${state.data.forecast.length} dias. Unidade: ${unit === 'celsius' ? 'Celsius' : 'Fahrenheit'}.`
      : state.status === 'empty'
        ? 'Nenhuma cidade encontrada.'
        : '';

  async function handleSearch(city: string) {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    setState({ status: 'loading' });
    try {
      const data = await searchMockWeather(trimmedCity);
      setState(data ? { status: 'success', data } : { status: 'empty' });
    } catch {
      setState({ status: 'error', city: trimmedCity });
    }
  }

  return (
    <div className="min-h-screen font-sans text-white">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-white px-4 py-3 font-semibold text-night-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent-400"
      >
        {'Ir para o conte\u00fado'}
      </a>
      <header className="border-b border-white/10 bg-night-900/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-5 sm:gap-4 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <CloudSun
              aria-hidden="true"
              size={32}
              className="h-6 w-6 shrink-0 text-sun sm:h-8 sm:w-8"
            />
            <h1 className="min-w-0 break-words text-base font-semibold sm:text-xl">WeatherView</h1>
          </div>
          <div className="col-span-2 row-start-2 min-w-0 lg:col-span-1 lg:col-start-2 lg:row-start-1">
            <SearchBar onSearch={handleSearch} disabled={state.status === 'loading'} />
          </div>
          <div className="col-start-2 row-start-1 lg:col-start-3">
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
        </div>
      </header>
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        aria-label={'Conte\u00fado do clima'}
        className="mx-auto max-w-6xl px-4 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 sm:px-6"
      >
        {state.status === 'idle' && (
          <EmptyState
            title="Nenhuma cidade selecionada"
            hint={'Clima atual e previs\u00e3o para os pr\u00f3ximos cinco dias.'}
          />
        )}
        {state.status === 'loading' && <LoadingState />}
        {state.status === 'empty' && <EmptyState />}
        {state.status === 'error' && <ErrorState onRetry={() => handleSearch(state.city)} />}
        {state.status === 'success' && (
          <>
            <CurrentWeather data={state.data} unit={unit} />
            <h2 className="mb-4 text-lg font-semibold">{'Previs\u00e3o de 5 dias'}</h2>
            <ForecastList forecast={state.data.forecast} unit={unit} />
          </>
        )}
      </main>
    </div>
  );
}
