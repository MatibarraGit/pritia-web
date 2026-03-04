import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { formatPrice, calculateTwoPayments } from "@/utils";

interface TwoPaymentsProps {
  price: number;
}

export const TwoPayments = ({ price }: TwoPaymentsProps) => {
  const plan = calculateTwoPayments(price);

  return (
    <Card className="border-2 border-primary/10 bg-gray-50">
      <CardContent className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-foreground">Pagá en 2 cuotas</h3>
        </div>

        <div className="space-y-3">
          {/* Opción 7 días */}
          <div className="rounded-md bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">Opción 7 días</span>
              <span className="text-xs text-muted-foreground">+{formatPrice(plan.sevenDays.surcharge)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">2 pagos de</span>
              <span className="font-bold text-primary text-lg font-heading">{formatPrice(plan.sevenDays.eachPayment)}</span>
            </div>
          </div>

          {/* Opción 15 días */}
          <div className="rounded-md bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">Opción 15 días</span>
              <span className="text-xs text-muted-foreground">+{formatPrice(plan.fifteenDays.surcharge)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">2 pagos de</span>
              <span className="font-bold text-primary text-lg font-heading">{formatPrice(plan.fifteenDays.eachPayment)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};