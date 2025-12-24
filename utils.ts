
import { Sale } from './types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const isToday = (timestamp: number): boolean => {
  const d1 = new Date(timestamp);
  const d2 = new Date();
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export const isWeekend = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  const day = date.getDay(); // 0 Sun, 1 Mon... 5 Fri, 6 Sat
  // We consider Fri (5), Sat (6), Sun (0)
  return day === 5 || day === 6 || day === 0;
};

export const getDayName = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('pt-BR', { weekday: 'long' });
};
