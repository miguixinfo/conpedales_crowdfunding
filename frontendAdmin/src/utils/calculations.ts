import type { Stage } from '../types';
import { TRIP_INFO } from '../config/constants';

// ============================================
// PAÍSES - Extraer países únicos de las stages
// ============================================
export function extractCountries(stages: Stage[]): string[] {
  const countries = new Set(stages.map(s => s.country));
  return Array.from(countries);
}

export function countCountries(stages: Stage[]): number {
  return extractCountries(stages).length;
}

// ============================================
// DÍAS - Calcular días desde fecha de inicio
// ============================================
export function calculateDaysSinceStart(): number {
  const now = new Date();
  const start = TRIP_INFO.startDate;
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function formatDays(days: number): string {
  return days.toLocaleString('es-ES');
}

// ============================================
// KM - Calcular kilómetros restantes
// ============================================
export function calculateRemainingKm(totalKm: number, goalKm: number): number {
  return Math.max(0, goalKm - totalKm);
}

export function calculateProgress(totalKm: number, goalKm: number): number {
  return Math.min(100, Math.round((totalKm / goalKm) * 100));
}

// ============================================
// KM FINANCIADOS - Calcular desde donaciones
// ============================================
export function calculateKmFinanced(totalFunded: number, pricePerKm: number): number {
  return Math.floor(totalFunded / pricePerKm);
}