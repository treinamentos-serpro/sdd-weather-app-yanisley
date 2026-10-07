const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  timeZone: 'UTC',
});

export function formatDay(date: string, index: number): string {
  if (index === 0) {
    return 'Hoje';
  }
  if (index === 1) {
    return 'Amanh\u00e3';
  }

  const day = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(day.getTime()) ? '\u2014' : weekdayFormatter.format(day);
}
