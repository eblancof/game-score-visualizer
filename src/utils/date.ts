export const formatGameDate = (date: Date) => ({
  full: date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }),
  time: date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
});