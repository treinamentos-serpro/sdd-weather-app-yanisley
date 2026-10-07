import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

afterEach(cleanup);

describe('LoadingState', () => {
  it('anuncia o carregamento com role status', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando o clima...');
  });
});

describe('ErrorState', () => {
  it('anuncia a mensagem recebida e oferece a acao de tentar novamente', () => {
    render(<ErrorState message="Falha de conexao." onRetry={vi.fn()} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Falha de conexao.');
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
  });

  it('fornece uma mensagem padrao quando nenhuma e informada', () => {
    render(<ErrorState onRetry={vi.fn()} />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'N\u00e3o foi poss\u00edvel carregar os dados. Tente novamente.',
    );
  });

  it('chama onRetry ao clicar sem enviar o formulario', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <ErrorState onRetry={onRetry} />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it.each(['{Enter}', ' '])('permite tentar novamente com o teclado: %s', async (key) => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toHaveFocus();
    await user.keyboard(key);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyState', () => {
  it('exibe titulo e dica padrao em uma regiao acessivel', () => {
    render(<EmptyState />);

    expect(screen.getByRole('region', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
    expect(
      screen.getByText('Confira o nome da cidade ou tente buscar outra localidade.'),
    ).toBeVisible();
  });

  it('aceita titulo e dica personalizados', () => {
    render(<EmptyState title="Busque uma cidade" hint="Digite o nome da localidade." />);

    expect(screen.getByRole('region', { name: 'Busque uma cidade' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Busque uma cidade' })).toBeVisible();
    expect(screen.getByText('Digite o nome da localidade.')).toBeVisible();
  });
});
