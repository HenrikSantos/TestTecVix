/**
 * Formata uma data para string de tempo no formato brasileiro (HH:MM:SS)
 * @param date - Data a ser formatada (padrão: data atual)
 * @returns String formatada no padrão HH:MM:SS
 */
export const formatTimeBR = (date: Date = new Date()): string => {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
