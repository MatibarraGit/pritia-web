// Mock data modular - estructura exacta de la API
// Reemplazar por llamada API real cuando esté disponible

export interface InstallmentPlan {
  installments: number;
  installment_amount: number;
  total_amount: number;
  interest_percentage: number;
  cft: string;
  tea: string;
}

export interface Issuer {
  id: string;
  name: string;
}

export interface PaymentMethodData {
  payment_method_id: string;
  issuer: Issuer;
  installments: InstallmentPlan[];
}

export const paymentMethods: PaymentMethodData[] = [
  {
    payment_method_id: "visa",
    issuer: { id: "2035", name: "Banco Nación" },
    installments: [
      { installments: 1, installment_amount: 100000, total_amount: 100000, interest_percentage: 0, cft: "0,00%", tea: "0,00%" },
      { installments: 3, installment_amount: 41960, total_amount: 125880, interest_percentage: 25.88, cft: "309,00%", tea: "226,00%" },
      { installments: 6, installment_amount: 22663, total_amount: 135980, interest_percentage: 35.98, cft: "199,00%", tea: "151,00%" },
      { installments: 9, installment_amount: 16440, total_amount: 147960, interest_percentage: 47.96, cft: "178,00%", tea: "137,00%" },
      { installments: 12, installment_amount: 13497, total_amount: 161960, interest_percentage: 61.96, cft: "172,00%", tea: "133,00%" },
    ],
  },
  {
    payment_method_id: "visa",
    issuer: { id: "2036", name: "Banco Provincia" },
    installments: [
      { installments: 1, installment_amount: 100000, total_amount: 100000, interest_percentage: 0, cft: "0,00%", tea: "0,00%" },
      { installments: 3, installment_amount: 40500, total_amount: 121500, interest_percentage: 21.50, cft: "280,00%", tea: "205,00%" },
      { installments: 6, installment_amount: 21833, total_amount: 131000, interest_percentage: 31.00, cft: "185,00%", tea: "141,00%" },
      { installments: 9, installment_amount: 15889, total_amount: 143000, interest_percentage: 43.00, cft: "165,00%", tea: "128,00%" },
      { installments: 12, installment_amount: 13083, total_amount: 157000, interest_percentage: 57.00, cft: "160,00%", tea: "124,00%" },
    ],
  },
  {
    payment_method_id: "mastercard",
    issuer: { id: "3001", name: "Banco Galicia" },
    installments: [
      { installments: 1, installment_amount: 100000, total_amount: 100000, interest_percentage: 0, cft: "0,00%", tea: "0,00%" },
      { installments: 3, installment_amount: 42300, total_amount: 126900, interest_percentage: 26.90, cft: "315,00%", tea: "230,00%" },
      { installments: 6, installment_amount: 22900, total_amount: 137400, interest_percentage: 37.40, cft: "205,00%", tea: "156,00%" },
      { installments: 9, installment_amount: 16700, total_amount: 150300, interest_percentage: 50.30, cft: "183,00%", tea: "141,00%" },
      { installments: 12, installment_amount: 13750, total_amount: 165000, interest_percentage: 65.00, cft: "178,00%", tea: "138,00%" },
    ],
  },
  {
    payment_method_id: "mastercard",
    issuer: { id: "3002", name: "Banco Santander" },
    installments: [
      { installments: 1, installment_amount: 100000, total_amount: 100000, interest_percentage: 0, cft: "0,00%", tea: "0,00%" },
      { installments: 3, installment_amount: 41200, total_amount: 123600, interest_percentage: 23.60, cft: "295,00%", tea: "215,00%" },
      { installments: 6, installment_amount: 22100, total_amount: 132600, interest_percentage: 32.60, cft: "190,00%", tea: "145,00%" },
      { installments: 9, installment_amount: 16100, total_amount: 144900, interest_percentage: 44.90, cft: "168,00%", tea: "130,00%" },
      { installments: 12, installment_amount: 13250, total_amount: 159000, interest_percentage: 59.00, cft: "163,00%", tea: "126,00%" },
    ],
  },
  {
    payment_method_id: "amex",
    issuer: { id: "4001", name: "American Express" },
    installments: [
      { installments: 1, installment_amount: 100000, total_amount: 100000, interest_percentage: 0, cft: "0,00%", tea: "0,00%" },
      { installments: 3, installment_amount: 43500, total_amount: 130500, interest_percentage: 30.50, cft: "340,00%", tea: "248,00%" },
      { installments: 6, installment_amount: 23800, total_amount: 142800, interest_percentage: 42.80, cft: "225,00%", tea: "170,00%" },
      { installments: 9, installment_amount: 17400, total_amount: 156600, interest_percentage: 56.60, cft: "200,00%", tea: "153,00%" },
      { installments: 12, installment_amount: 14500, total_amount: 174000, interest_percentage: 74.00, cft: "195,00%", tea: "150,00%" },
    ],
  },
  {
    payment_method_id: "naranja_x",
    issuer: { id: "5001", name: "Naranja X" },
    installments: [
      { installments: 1, installment_amount: 100000, total_amount: 100000, interest_percentage: 0, cft: "0,00%", tea: "0,00%" },
      { installments: 3, installment_amount: 40000, total_amount: 120000, interest_percentage: 20.00, cft: "265,00%", tea: "195,00%" },
      { installments: 6, installment_amount: 21500, total_amount: 129000, interest_percentage: 29.00, cft: "175,00%", tea: "135,00%" },
      { installments: 9, installment_amount: 15600, total_amount: 140400, interest_percentage: 40.40, cft: "158,00%", tea: "123,00%" },
      { installments: 12, installment_amount: 12833, total_amount: 154000, interest_percentage: 54.00, cft: "155,00%", tea: "120,00%" },
    ],
  },
];

// Helpers
export const getPaymentMethodLabel = (id: string): string => {
  const labels: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "American Express",
    naranja_x: "Naranja X",
  };
  return labels[id] || id;
};

export const getUniquePaymentMethodIds = (): string[] => {
  return [...new Set(paymentMethods.map((pm) => pm.payment_method_id))];
};

export const getIssuersByMethod = (methodId: string): PaymentMethodData[] => {
  return paymentMethods.filter((pm) => pm.payment_method_id === methodId);
};