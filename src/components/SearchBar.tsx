import { type FormEvent, useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const inputId = useId();
  const [city, setCity] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedCity = city.trim();

    if (disabled || !trimmedCity) {
      return;
    }

    onSearch(trimmedCity);
  }

  return (
    <form
      role="search"
      aria-label="Busca de cidade"
      onSubmit={handleSubmit}
      className="w-full rounded-lg border border-white/10 bg-white/5 p-4 font-sans text-white backdrop-blur-md"
    >
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium">
        Cidade
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          name="city"
          type="search"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          disabled={disabled}
          placeholder="Nome da cidade"
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/40 bg-night-900 px-3 py-2 text-base text-white placeholder:text-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || !city.trim()}
          className="min-h-11 shrink-0 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-night-900 hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
