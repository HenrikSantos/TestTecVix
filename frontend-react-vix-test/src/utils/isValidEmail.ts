/**
 * Valida se uma string é um email válido
 * @param email - String a ser validada
 * @returns true se for um email válido, false caso contrário
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
