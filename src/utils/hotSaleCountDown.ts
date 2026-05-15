function getNextSunday(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const target = new Date(now);
  target.setDate(now.getDate() + daysUntilSunday);
  target.setHours(23, 59, 59, 0);
  return target;
}

export const DEADLINE = getNextSunday();
const SALE_START = new Date(DEADLINE);
SALE_START.setDate(SALE_START.getDate() - 7);

// En TS, restar fechas devuelve un número (timestamps), lo forzamos con .getTime() por claridad
export const TOTAL_DURATION = DEADLINE.getTime() - SALE_START.getTime();

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}