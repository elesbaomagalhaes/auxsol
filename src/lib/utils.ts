import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Função para validar e formatar entrada de números decimais
 * @param value Valor do input
 * @param decimalPlaces Número de casas decimais (padrão: 2)
 * @returns Valor formatado
 */
export function formatDecimalInput(value: string, decimalPlaces: number = 2): string {
  // Remove caracteres não numéricos exceto ponto
  let formattedValue = value.replace(/[^0-9.]/g, '');
  
  // Garante que só existe um ponto decimal
  const parts = formattedValue.split('.');
  if (parts.length > 2) {
    formattedValue = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limita ao número de casas decimais especificado
  if (parts.length > 1 && parts[1].length > decimalPlaces) {
    formattedValue = parts[0] + '.' + parts[1].substring(0, decimalPlaces);
  }
  
  return formattedValue;
}

/**
 * Função para formatar número com casas decimais fixas ao perder o foco
 * @param value Valor do input
 * @param decimalPlaces Número de casas decimais (padrão: 2)
 * @returns Valor formatado com casas decimais fixas ou valor original se inválido
 */
export function formatDecimalOnBlur(value: string, decimalPlaces: number = 2): string {
  if (value && !isNaN(parseFloat(value))) {
    return parseFloat(value).toFixed(decimalPlaces);
  }
  return value;
}
