import { buildCreditInstallmentCatalogSummary } from "@/services/mercado-pago";

import { CreditCardInstallmentsClient } from "./CreditCardInstallmentsClient";

type CreditCardSectionProps = {
  price: number;
  discountPercent: number;
  originalPrice?: number;
};

export async function CreditCardSection({ price, discountPercent, originalPrice }: CreditCardSectionProps) {
  if (!Number.isFinite(price) || price <= 0) return null;

  const catalog = await buildCreditInstallmentCatalogSummary(price);

  return <CreditCardInstallmentsClient catalog={catalog} price={price} discountPercent={discountPercent} originalPrice={originalPrice} />;
}
