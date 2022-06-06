export function formatDate(
  d: string,
  formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    weekday: 'short',
  },
  locale = 'sv-SE'
): string {
  return new Date(Date.parse(d)).toLocaleDateString(locale, formatOptions);
}

export function formatTime(
  date: string,
  time: string,
  formatOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
  },
  locale = 'sv-SE'
): string {
  return new Date(Date.parse(`${date}T${time}`)).toLocaleTimeString(locale, formatOptions);
}
