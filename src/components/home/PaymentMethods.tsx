import { CreditCard, Truck } from "lucide-react";

export const PaymentMethods = () => {
  return (
    <div className="bg-gray-100 py-6">
      <div className="container w-11/12 max-w-content mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-items-center">
          
          {/* Payment methods */}
          <div className="flex items-center gap-2">
            <CreditCard className="w-10 h-10 text-blue-600" />
            <span className="text-sm font-medium">Múltiples métodos de pago</span>
          </div>
          
          {/* Free shipping */}
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Envíos a todo el país mediante Via Cargo</span>
          </div>
        </div>
      </div>
    </div>
  );
};