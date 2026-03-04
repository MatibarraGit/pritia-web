import { Truck, CreditCard, ShieldCheck } from "lucide-react";

export function ProductPurchaseInfo() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="flex flex-col items-center text-center p-3 rounded-md bg-gray-300/20 text-gray-700">
        <Truck className="h-5 w-5 mb-1 text-black" />
        <span className="text-xs">Envío a domicilio</span>
      </div>
      <div className="flex flex-col items-center text-center p-3 rounded-md bg-gray-300/20 text-gray-700">
        <CreditCard className="h-5 w-5 mb-1 text-black" />
        <span className="text-xs">
          Tarjetas de crédito
        </span>
      </div>
      <div className="flex flex-col items-center text-center p-3 rounded-md bg-gray-300/20 text-gray-700">
        <ShieldCheck className="h-5 w-5 mb-1 text-black" />
        <span className="text-xs">Compra segura</span>
      </div>
    </div>
  );
}
