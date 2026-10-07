import { LoaderCircle } from 'lucide-react';

export default function LoadingState() {
  return (
    <div
      role="status"
      className="flex w-full items-center justify-center gap-3 border-y border-white/10 bg-white/5 px-4 py-8 font-sans text-white backdrop-blur-md"
    >
      <LoaderCircle
        aria-hidden="true"
        size={24}
        className="shrink-0 animate-spin text-accent-400 motion-reduce:animate-none"
      />
      <p className="text-sm">Carregando o clima...</p>
    </div>
  );
}
