import { MercadoPagoInstallment } from "@/types";

export function filterFinancingByBank(
  financingData: MercadoPagoInstallment[],
  bankName: string
) {
  return financingData.filter(
    (item) =>
      item.issuer.name.toLowerCase() === bankName.toLowerCase() && item.payment_type_id === 'credit_card'
  )
}