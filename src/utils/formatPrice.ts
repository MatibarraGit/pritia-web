export function formatPrice(price: number): string {
  const formattedPrice = Math.floor(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${formattedPrice}`
}

export const formatPrice2 = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};