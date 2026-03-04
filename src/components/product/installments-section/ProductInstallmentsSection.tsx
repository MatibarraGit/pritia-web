import { TwoPayments, WeeklyInstallments } from "@/components";

interface ProductInstallmentsSectionProps {
  price: number;
  purchasePrice: number;
}

export const ProductInstallmentsSection = ({ price, purchasePrice }: ProductInstallmentsSectionProps) => {
  return (
    <div className="space-y-3">
      {/* Resumen de cuotas según monto */}
      {price >= 100000 ? (
        <WeeklyInstallments price={price} purchasePrice={purchasePrice} />
      ) : (
        <TwoPayments price={price} />
      )}

      {/* Sección de tarjetas de crédito */}
    </div>
  );
};
