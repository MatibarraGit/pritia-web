export const DEADLINE = new Date(2026, 4, 17, 23, 59, 59, 0);
const SALE_START = new Date(DEADLINE);
SALE_START.setDate(SALE_START.getDate() - 7);

// En TS, restar fechas devuelve un número (timestamps), lo forzamos con .getTime() por claridad
export const TOTAL_DURATION = DEADLINE.getTime() - SALE_START.getTime();

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
