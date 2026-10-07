import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UnitToggle from '../../src/components/UnitToggle';

afterEach(cleanup);

describe('UnitToggle', () => {
  it('agrupa os botoes com nome acessivel e indica Celsius ativo', () => {
    render(<UnitToggle unit="celsius" onChange={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeVisible();
    expect(screen.getByRole('button', { name: '\u00b0C', pressed: true })).toBeVisible();
    expect(screen.getByRole('button', { name: '\u00b0F', pressed: false })).toBeVisible();
  });

  it('atualiza aria-pressed quando a prop unit muda', () => {
    const onChange = vi.fn();
    const { rerender } = render(<UnitToggle unit="celsius" onChange={onChange} />);

    rerender(<UnitToggle unit="fahrenheit" onChange={onChange} />);

    expect(screen.getByRole('button', { name: '\u00b0C' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: '\u00b0F' })).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('informa a unidade selecionada sem alterar a prop recebida', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<UnitToggle unit="celsius" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '\u00b0F' }));
    expect(onChange).toHaveBeenNthCalledWith(1, 'fahrenheit');
    expect(screen.getByRole('button', { name: '\u00b0C' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: '\u00b0C' }));
    expect(onChange).toHaveBeenNthCalledWith(2, 'celsius');
  });

  it('permite navegar com Tab e Shift+Tab e ativar com Enter e Espaco', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<UnitToggle unit="celsius" onChange={onChange} />);

    await user.tab();
    expect(screen.getByRole('button', { name: '\u00b0C' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenNthCalledWith(1, 'celsius');

    await user.tab();
    expect(screen.getByRole('button', { name: '\u00b0F' })).toHaveFocus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenNthCalledWith(2, 'fahrenheit');

    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: '\u00b0C' })).toHaveFocus();
  });

  it('nao envia um formulario ao selecionar a unidade', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <UnitToggle unit="celsius" onChange={vi.fn()} />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: '\u00b0F' }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
