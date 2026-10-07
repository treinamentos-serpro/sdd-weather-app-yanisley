import { SearchX } from 'lucide-react';
import { useId } from 'react';

interface EmptyStateProps {
  title?: string;
  hint?: string;
}

export default function EmptyState({
  title = 'Nenhuma cidade encontrada',
  hint = 'Confira o nome da cidade ou tente buscar outra localidade.',
}: EmptyStateProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="flex w-full flex-col items-center gap-3 border-y border-white/10 bg-white/5 px-4 py-8 text-center font-sans text-white backdrop-blur-md"
    >
      <SearchX aria-hidden="true" size={28} className="shrink-0 text-accent-400" />
      <h2 id={titleId} className="max-w-full text-base font-semibold [overflow-wrap:anywhere]">
        {title}
      </h2>
      <p className="w-full max-w-prose text-sm text-white/70 [overflow-wrap:anywhere]">{hint}</p>
    </section>
  );
}
