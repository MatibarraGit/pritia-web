/**
 * Redondea hacia al $5000 o $0000 más cercano.
 * Ej: 81475 → 80000, 57500 → 60000, 55200 → 55000
 */
const roundTo5000 = (amount: number): number => {
  return Math.round(amount / 5000) * 5000;
};

/**
 * Cuotas semanales para productos > $100.000
 * Precio final = precio + recargo según precio
 * Entrega inicial = 39% del precio, redondeado al $5000/$0000 más cercano
 * 4 cuotas semanales = (precio final - entrega inicial) / 4 redondeado al $500/$000 más cercano
 */
export const calculateWeeklyInstallments = (price: number, purchasePrice: number) => {
  let finalPrice;
  
  if (price > 800000) {
    finalPrice = price + 60000;
  } else if (price > 550000) {
    finalPrice = price + 50000;
  } else if (price > 350000) {
    finalPrice = price + 40000;
  } else {
    finalPrice = price + 30000;
  }

  const initialPayment = roundTo5000(purchasePrice * 0.39);
  const remaining = finalPrice - initialPayment;
  const weeklyAmount = Math.round(remaining / 4 / 500) * 500;

  return {
    finalPrice,
    initialPayment,
    weeklyAmount,
    totalWeekly: weeklyAmount * 4,
    totalFinanced: initialPayment + weeklyAmount * 4,
  };
};

/**
 * 2 pagos para productos < $100.000
 * Opción 7 días: cada pago = (precio + $7.500) / 2
 * Opción 15 días: cada pago = (precio + $15.000) / 2
 */
export const calculateTwoPayments = (price: number) => {
  const sevenDayTotal = price + 7500;
  const fifteenDayTotal = price + 15000;

  return {
    sevenDays: {
      eachPayment: Math.round(sevenDayTotal / 2),
      total: sevenDayTotal,
      surcharge: 7500,
    },
    fifteenDays: {
      eachPayment: Math.round(fifteenDayTotal / 2),
      total: fifteenDayTotal,
      surcharge: 15000,
    },
  };
};