import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { formatPrice, calculateWeeklyInstallments } from "@/utils";

interface WeeklyInstallmentsProps {
  price: number;
  purchasePrice: number;
}

export const WeeklyInstallments = ({ price, purchasePrice }: WeeklyInstallmentsProps) => {
  const plan = calculateWeeklyInstallments(price, purchasePrice);

  return (
    <Card className="border-2 border-primary/10 bg-gray-50">
    {/* <Card className="border-2 border-primary/10 bg-primary/3"> */}
      <CardContent className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-foreground">Pagá en cuotas semanales</h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 px-3 rounded-md bg-white shadow-sm">
            <span className="text-sm text-muted-foreground">4 cuotas semanales de</span>
            <span className="font-bold text-primary text-xl font-heading">{formatPrice(plan.weeklyAmount)}</span>
          </div>

          <div className="flex justify-between items-center py-2 px-3 rounded-md bg-white shadow-sm">
            <span className="text-sm text-muted-foreground">Entrega inicial</span>
            <span className="font-bold text-foreground text-md">{formatPrice(plan.initialPayment)}</span>
          </div>

          <div className="border-t border-border pt-3 mt-3">
            <div className="flex justify-between items-center px-3 text-xs">
              <span className="text-muted-foreground">Total financiado</span>
              <span className="font-semibold text-muted-foreground">{formatPrice(plan.totalFinanced)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};