import { CircleAlert, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = 'N\u00e3o foi poss\u00edvel carregar os dados. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex w-full flex-col items-center gap-3 border-y border-white/10 bg-white/5 px-4 py-8 text-center font-sans text-white backdrop-blur-md"
    >
      <CircleAlert aria-hidden="true" size={28} className="shrink-0 text-sun" />
      <h2 className="max-w-full text-base font-semibold [overflow-wrap:anywhere]">
        Erro ao carregar o clima
      </h2>
      <p className="w-full max-w-prose text-sm text-white/70 [overflow-wrap:anywhere]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="flex min-h-11 max-w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-night-900 hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
      >
        <RotateCcw aria-hidden="true" size={18} className="shrink-0" />
        <span className="break-words">Tentar novamente</span>
      </button>
    </div>
  );
}
