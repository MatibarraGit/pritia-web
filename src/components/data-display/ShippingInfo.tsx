import { Car, Mail, MapPin, Truck } from "lucide-react";
import { cn } from "@/libs/utils";

export const ShippingInfo = ({ isHelpPage = false }: { isHelpPage?: boolean }) => {
  const localShippingZones = [
    "Cañuelas",
    "Virrey del Pino",
    "G. Catán",
    "G. Laferrere",
    "I. Casanova",
    "San Justo",
  ];

  return (
    <>
      {/* Header */}
      {!isHelpPage && (
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-subheading">Información de Envíos</h2>
        </div>
      )}

      <div 
        className={cn(
          "block",
          isHelpPage && "lg:grid lg:grid-cols-2 lg:gap-x-6"
        )}
      >
        {/* Sección envíos locales */}
        <div className={cn(
          "mb-6",
          isHelpPage && "bg-white rounded-lg p-4 shadow-md"
        )}>
          <div className="center-flex gap-2 mb-3">
            <Car className="w-5 h-5 text-green-600" />
            <h3 className="text-base font-subheading">Envíos por Nuestra Cuenta</h3>
          </div>

          <p className="mb-4 text-sm text-gray-600">
            Realizamos envíos gratuitos o con costo reducido a las siguientes
            zonas:
          </p>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {localShippingZones.map((zone) => (
              <div key={zone} className="flex items-center gap-2 p-2 rounded-md bg-green-500/10">
                <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-sm text-gray-700">{zone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sección envíos nacionales */}
        <div className={cn(
          "mb-2 border-gray-200 border-t pt-6",
          isHelpPage && "p-4 mb-6 bg-white rounded-lg shadow-md border-none"
        )}>
          <div className="center-flex gap-2 mb-3">
            <Mail className="w-4 h-4 text-primary" />
            <h3 className="text-base font-subheading ">Envíos a Todo el País</h3>
          </div>
          <p className="text-sm text-gray-600">
            Enviamos a cualquier lugar de Argentina mediante correo postal. Los
            gastos de envío corren por cuenta del comprador y se calculan según
            destino y peso del paquete.
          </p>

          <div className="p-4 mt-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-sm font-medium text-primary">
              Consultá disponibilidad y costos de envío antes de realizar tu compra
            </div>
          </div>
        </div>
        {/* Nota */}
      </div>

    </>
  );
};

