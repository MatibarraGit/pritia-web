import type { CreditInstallmentQuote } from "@/types";
import { FINANCING_CONFIG } from "@/utils";

export function getInstallmentAmount(installments: number, installmentAmount: number, listPrice: number) {
  if (installments <= FINANCING_CONFIG.interestFreeInstallments) return listPrice / installments
  else return installmentAmount
}

export function getInstallmentLabel(installments: number, listPrice: number, quote?: CreditInstallmentQuote) {
  const installmentWord = installments === 1 ? "cuota" : "cuotas";

  if (!quote) return `${installments} ${installmentWord} no disponibles`;

  const financingLabel = quote.totalAmount <= listPrice ? "sin interés" : "fijas";
  return `${installments} ${installmentWord} ${financingLabel} de`;
}

export function getPaymentMethodOptions() {
  const options = new Map

  FINANCING_CONFIG.displayCardMethods.forEach((method) => {
    options.set(method.id, {
      ...method,
      id: method.id,
      name: method.name,
    });
  });

  return [...options.values()];
}

export function getQuotesForSelection(
  quotes: CreditInstallmentQuote[],
  paymentMethodId: string,
  issuerId: string,
) {
  if (!paymentMethodId || !issuerId) return [];

  const methodQuotes = quotes.filter((quote) =>
    isSamePaymentMethod(quote.paymentMethodId, paymentMethodId),
  );

  return methodQuotes
    .filter((quote) => quote.issuerId === issuerId)
    .sort((a, b) => a.installments - b.installments);
}

function isSamePaymentMethod(a: string, b: string) {
  return a === b;
}
