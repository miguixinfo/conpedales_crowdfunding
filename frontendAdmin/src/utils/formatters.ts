// ============================================
// FECHAS
// ============================================
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  });
}

// ============================================
// NÚMEROS
// ============================================
export function formatNumber(num: number): string {
  return num.toLocaleString('es-ES');
}

export function formatCurrency(num: number): string {
  return num.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
  });
}

export function formatKm(num: number): string {
  return `${num.toLocaleString('es-ES')} km`;
}

export function formatMeters(num: number): string {
  return `${num.toLocaleString('es-ES')} m`;
}

// ============================================
// STAGE - Título formateado
// ============================================
export function formatStageTitle(stage: { startName: string; endName: string }): string {
  return `${stage.startName} → ${stage.endName}`;
}

// ============================================
// TIEMPO ESTIMADO
// ============================================
export function estimateTime(km: number): string {
  const hours = Math.round(km / 20);
  if (hours < 1) return '< 1h';
  return `${hours}h`;
}